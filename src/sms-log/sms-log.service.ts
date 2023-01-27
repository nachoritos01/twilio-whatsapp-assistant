import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSmsLogDto } from './dtos/create-sms-log.dto';
import { SmsLog } from './entities/sms-log.entity';

@Injectable()
export class SmsLogService {
  constructor(
    @InjectRepository(SmsLog) private readonly repo: Repository<SmsLog>
  ) {}

  create(createSmsLogDto: CreateSmsLogDto) {
    return this.repo.save(createSmsLogDto);
  }
}
