import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class AppService {
  public constructor(private readonly twilioService: TwilioService) {}

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
        to: process.env.TEST_PHONE_NUMBER
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
}
