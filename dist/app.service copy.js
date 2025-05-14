"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_twilio_1 = require("nestjs-twilio");
const sms_log_service_1 = require("./sms-log/sms-log.service");
const console_1 = require("console");
const ioredis_1 = require("ioredis");
let AppService = class AppService {
    constructor(twilioService, smsLogService) {
        this.twilioService = twilioService;
        this.smsLogService = smsLogService;
        this.redis = new ioredis_1.default();
    }
    async getUserState(userId) {
        return (await this.redis.get(userId)) || 'start';
    }
    async setUserState(userId, state) {
        await this.redis.set(userId, state);
    }
    homeApi() {
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
        }
        catch (error) {
            (0, console_1.log)('Error sending WhatsApp message:', error);
            return {
                error: 'Something went wrong!',
                status: 500
            };
        }
    }
    async replyToWhatsapp(body) {
        try {
            const incomingMessage = body.Body.toLowerCase();
            const from = body.From;
            const to = body.To;
            const userState = await this.getUserState(from);
            let responseMessage = '';
            if (userState === 'start') {
                if (incomingMessage.includes('hola')) {
                    responseMessage =
                        '¡Hola! ¿Qué deseas hacer?\n1. Crear una cita\n2. Cancelar una cita\n3. Ver horarios disponibles\n4. Hablar con un agente';
                    await this.setUserState(from, 'menu');
                }
                else {
                    responseMessage = 'Por favor, escribe "Hola" para comenzar.';
                }
            }
            else if (userState === 'menu') {
                if (incomingMessage === '1') {
                    responseMessage =
                        'Por favor, indícame una fecha para tu cita (por ejemplo: "15 de mayo").';
                    await this.setUserState(from, 'creating_appointment_date');
                }
                else if (incomingMessage === '2') {
                    responseMessage =
                        'Por favor, proporciona el ID de la cita que deseas cancelar.';
                    await this.setUserState(from, 'cancelling_appointment');
                }
                else if (incomingMessage === '3') {
                    responseMessage =
                        'Estos son los horarios disponibles:\n- Lunes a Viernes: 9am - 5pm\n- Sábado: 10am - 2pm\n¿Deseas agendar una cita? Responde con "1".';
                    await this.setUserState(from, 'viewing_schedule');
                }
                else if (incomingMessage === '4') {
                    responseMessage = 'Conectándote con un agente... Por favor espera.';
                    await this.setUserState(from, 'talking_to_agent');
                }
                else {
                    responseMessage =
                        'Lo siento, no entendí tu mensaje. Por favor, responde con "1", "2", "3" o "4".';
                }
            }
            else if (userState === 'creating_appointment_date') {
                responseMessage =
                    'Por favor, indícame una hora para tu cita (por ejemplo: "3pm").';
                await this.setUserState(from, 'creating_appointment_time');
                await this.setUserState(`${from}_date`, incomingMessage);
            }
            else if (userState === 'creating_appointment_time') {
                const appointmentDate = await this.getUserState(`${from}_date`);
                responseMessage = `Tu cita ha sido registrada para el ${appointmentDate} a las ${incomingMessage}. ¡Gracias!`;
                await this.setUserState(from, 'start');
            }
            else if (userState === 'cancelling_appointment') {
                responseMessage = `La cita con ID "${incomingMessage}" ha sido cancelada.`;
                await this.setUserState(from, 'start');
            }
            else if (userState === 'viewing_schedule') {
                if (incomingMessage === '1') {
                    responseMessage =
                        'Por favor, indícame una fecha para tu cita (por ejemplo: "15 de mayo").';
                    await this.setUserState(from, 'creating_appointment_date');
                }
                else {
                    responseMessage =
                        'Volviendo al inicio. ¿Qué deseas hacer?\n1. Crear una cita\n2. Cancelar una cita\n3. Ver horarios disponibles\n4. Hablar con un agente';
                    await this.setUserState(from, 'menu');
                }
            }
            else if (userState === 'talking_to_agent') {
                responseMessage =
                    'Un agente se pondrá en contacto contigo pronto. ¡Gracias por tu paciencia!';
                await this.setUserState(from, 'start');
            }
            return this.twilioService.client.messages.create({
                body: responseMessage,
                from: to,
                to: from
            });
        }
        catch (error) {
            console.error('Error replying to WhatsApp message:', error);
            return {
                error: 'Something went wrong!',
                status: 500
            };
        }
    }
    async sendSMS() {
        try {
            (0, console_1.log)(process.env);
            const smsResponse = await this.twilioService.client.messages.create({
                body: "Well, I woke up this mornin' and I got myself a beer. The future's uncertain and the end is always near!",
                from: process.env.TWILIO_PHONE_NUMBER,
                to: process.env.TEST_PHONE_NUMBER,
                statusCallback: `${process.env.NGROK_URL}/sms-callback`
            });
            return smsResponse;
        }
        catch (error) {
            (0, console_1.log)('Error sending SMS:', error);
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
    async handleCallback(createSmsLogDto) {
        return this.smsLogService.create(createSmsLogDto);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_twilio_1.TwilioService,
        sms_log_service_1.SmsLogService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service%20copy.js.map