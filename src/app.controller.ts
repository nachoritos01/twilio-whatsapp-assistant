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

  @Post('/sms-callback')
  handleCallback(@Body() body: CreateSmsLogDto) {
    return this.appService.handleCallback(body);
  }
}
