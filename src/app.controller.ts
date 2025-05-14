import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';
import { get } from 'http';
import { GoogleCalendarService } from './google-calendar.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private calendar: GoogleCalendarService
  ) {}

  @Get()
  homeApi(): { status: number; message: string } {
    return this.appService.homeApi();
  }
  @Get('/list-events-calendar')
  async listEventsCalendar() {
    return await this.calendar.listUpcomingEvents();
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
