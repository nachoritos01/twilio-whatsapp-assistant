import { Repository } from 'typeorm';
import { CreateSmsLogDto } from './dtos/create-sms-log.dto';
import { SmsLog } from './entities/sms-log.entity';
export declare class SmsLogService {
    private readonly repo;
    constructor(repo: Repository<SmsLog>);
    create(createSmsLogDto: CreateSmsLogDto): Promise<CreateSmsLogDto & SmsLog>;
}
