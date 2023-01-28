import { TwilioService } from 'nestjs-twilio';
import { CreateSmsLogDto } from './sms-log/dtos/create-sms-log.dto';
import { SmsLogService } from './sms-log/sms-log.service';
export declare class AppService {
    private readonly twilioService;
    private readonly smsLogService;
    constructor(twilioService: TwilioService, smsLogService: SmsLogService);
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
    handleCallback(createSmsLogDto: CreateSmsLogDto): Promise<CreateSmsLogDto & import("./sms-log/entities/sms-log.entity").SmsLog>;
}
