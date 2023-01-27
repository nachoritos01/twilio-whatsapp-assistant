import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';
import { SmsLogService } from './sms-log/sms-log.service';

@Injectable()
export class AppService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly smsLogService: SmsLogService
  ) {}

  homeApi(): { status: number; message: string } {
    return {
      status: 200,
      message: "To send an SMS using Twilio, go to the '/send-sms' route."
    };
  }

  async sendSMS() {
    try {
      const smsResponse = await this.twilioService.client.messages.create({
        body: "Well, I woke up this mornin' and I got myself a beer. The future's uncertain and the end is always near!",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.TEST_PHONE_NUMBER,
        statusCallback: `http://localhost:${process.env.PORT}/sms-callback`
      });
      return smsResponse;
    } catch (error) {
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
