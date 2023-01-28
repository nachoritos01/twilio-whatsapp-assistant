import { AppService } from './app.service';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    homeApi(): {
        status: number;
        message: string;
    };
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
    handleCallback(body: CreateSmsLogDto): Promise<CreateSmsLogDto & import("./sms-log/entities/sms-log.entity").SmsLog>;
}
