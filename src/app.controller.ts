import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  homeApi(): { status: number; message: string } {
    return this.appService.homeApi();
  }

  @Get('/send-sms')
  sendSMS() {
    return this.appService.sendSMS();
  }

  @Get('/send-whatsapp')
  sendWhatsapp() {
    return this.appService.sendWhatsapp();
  }

  @Post('/whatsapp-reply')
  async replyToWhatsapp(@Body() body: any) {
    return this.appService.replyToWhatsapp(body);
  }

  @Post('/sms-callback')
  handleCallback(@Body() body: CreateSmsLogDto) {
    return this.appService.handleCallback(body);
  }
}

//https://timberwolf-mastiff-9776.twil.io/demo-reply
