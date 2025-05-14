import { AppService } from './app.service';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';
import { GoogleCalendarService } from './google-calendar.service';
export declare class AppController {
    private readonly appService;
    private calendar;
    constructor(appService: AppService, calendar: GoogleCalendarService);
    homeApi(): {
        status: number;
        message: string;
    };
    listEventsCalendar(): Promise<import("googleapis").calendar_v3.Schema$Event[]>;
    sendSMS(): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance | {
        error: any;
        status: any;
        code: any;
        moreInfo: any;
    } | {
        error: string;
        status: number;
        code?: undefined;
        moreInfo?: undefined;
    }>;
    sendWhatsapp(): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance | {
        error: string;
        status: number;
    }>;
    replyToWhatsapp(body: any): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance | {
        error: string;
        status: number;
    }>;
    handleCallback(body: CreateSmsLogDto): Promise<CreateSmsLogDto & import("./sms-log/entities/sms-log.entity").SmsLog>;
}
