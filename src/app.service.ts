import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';
import { SmsLogService } from './sms-log/sms-log.service';
import { log } from 'console';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  private readonly redis = new Redis(); // Conexión a Redis
  constructor(
    private readonly twilioService: TwilioService,
    private readonly smsLogService: SmsLogService
  ) {}

  async getUserState(userId: string): Promise<string> {
    return (await this.redis.get(userId)) || 'start'; // Devuelve el estado o 'start' por defecto
  }

  async setUserState(userId: string, state: string): Promise<void> {
    await this.redis.set(userId, state); // Guarda el estado del usuario
  }

  homeApi(): { status: number; message: string } {
    return {
      status: 200,
      message: "To send an SMS using Twilio, go to the '/send-sms' route."
    };
  }

  async sendWhatsapp() {
    try {
      const smsResponse = await this.twilioService.client.messages.create({
        from: 'whatsapp:+14155238886',
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+5219999023895'
      });
      return smsResponse;
    } catch (error) {
      log('Error sending WhatsApp message:', error);
      return {
        error: 'Something went wrong!',
        status: 500
      };
    }
  }

  async replyToWhatsapp(body: any) {
    try {
      const incomingMessage = body.Body.toLowerCase(); // Mensaje recibido
      const from = body.From; // Número del remitente
      const to = body.To; // Número de Twilio

      // Obtén el estado actual del usuario
      const userState = await this.getUserState(from);

      let responseMessage = '';

      if (userState === 'start') {
        // Inicio del flujo
        if (incomingMessage.includes('hola')) {
          responseMessage =
            '¡Hola! ¿Qué deseas hacer?\n1. Crear una cita\n2. Cancelar una cita\n3. Ver horarios disponibles\n4. Hablar con un agente';
          await this.setUserState(from, 'menu');
        } else {
          responseMessage = 'Por favor, escribe "Hola" para comenzar.';
        }
      } else if (userState === 'menu') {
        // Opciones principales
        if (incomingMessage === '1') {
          responseMessage =
            'Por favor, indícame una fecha para tu cita (por ejemplo: "15 de mayo").';
          await this.setUserState(from, 'creating_appointment_date');
        } else if (incomingMessage === '2') {
          responseMessage =
            'Por favor, proporciona el ID de la cita que deseas cancelar.';
          await this.setUserState(from, 'cancelling_appointment');
        } else if (incomingMessage === '3') {
          responseMessage =
            'Estos son los horarios disponibles:\n- Lunes a Viernes: 9am - 5pm\n- Sábado: 10am - 2pm\n¿Deseas agendar una cita? Responde con "1".';
          await this.setUserState(from, 'viewing_schedule');
        } else if (incomingMessage === '4') {
          responseMessage = 'Conectándote con un agente... Por favor espera.';
          await this.setUserState(from, 'talking_to_agent');
        } else {
          responseMessage =
            'Lo siento, no entendí tu mensaje. Por favor, responde con "1", "2", "3" o "4".';
        }
      } else if (userState === 'creating_appointment_date') {
        // Crear cita: seleccionar fecha
        responseMessage =
          'Por favor, indícame una hora para tu cita (por ejemplo: "3pm").';
        await this.setUserState(from, 'creating_appointment_time');
        await this.setUserState(`${from}_date`, incomingMessage); // Guarda la fecha temporalmente
      } else if (userState === 'creating_appointment_time') {
        // Crear cita: seleccionar hora
        const appointmentDate = await this.getUserState(`${from}_date`);
        responseMessage = `Tu cita ha sido registrada para el ${appointmentDate} a las ${incomingMessage}. ¡Gracias!`;
        await this.setUserState(from, 'start');
      } else if (userState === 'cancelling_appointment') {
        // Cancelar cita
        responseMessage = `La cita con ID "${incomingMessage}" ha sido cancelada.`;
        await this.setUserState(from, 'start');
      } else if (userState === 'viewing_schedule') {
        // Ver horarios disponibles
        if (incomingMessage === '1') {
          responseMessage =
            'Por favor, indícame una fecha para tu cita (por ejemplo: "15 de mayo").';
          await this.setUserState(from, 'creating_appointment_date');
        } else {
          responseMessage =
            'Volviendo al inicio. ¿Qué deseas hacer?\n1. Crear una cita\n2. Cancelar una cita\n3. Ver horarios disponibles\n4. Hablar con un agente';
          await this.setUserState(from, 'menu');
        }
      } else if (userState === 'talking_to_agent') {
        // Hablar con un agente
        responseMessage =
          'Un agente se pondrá en contacto contigo pronto. ¡Gracias por tu paciencia!';
        await this.setUserState(from, 'start');
      }

      // Envía la respuesta al usuario
      return this.twilioService.client.messages.create({
        body: responseMessage,
        from: to,
        to: from
      });
    } catch (error) {
      console.error('Error replying to WhatsApp message:', error);
      return {
        error: 'Something went wrong!',
        status: 500
      };
    }
  }

  async sendSMS() {
    try {
      log(process.env);
      const smsResponse = await this.twilioService.client.messages.create({
        body: "Well, I woke up this mornin' and I got myself a beer. The future's uncertain and the end is always near!",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.TEST_PHONE_NUMBER,
        statusCallback: `${process.env.NGROK_URL}/sms-callback` // Usa la URL pública de ngrok
      });
      return smsResponse;
    } catch (error) {
      log('Error sending SMS:', error);
      const twilioErrorStatuses = [400, 404, 410];
      if (twilioErrorStatuses.includes(error.status)) {
        const { message, status, code, moreInfo } = error;
        return {
          error: message,
          status,
          code,
          moreInfo
        };
      }
      return {
        error: 'Something went wrong!',
        status: 500
      };
    }
  }

  async handleCallback(createSmsLogDto: CreateSmsLogDto) {
    return this.smsLogService.create(createSmsLogDto);
  }
}
