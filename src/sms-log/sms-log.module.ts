import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsLog } from './entities/sms-log.entity';
import { SmsLogService } from './sms-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmsLog])],
  providers: [SmsLogService],
  exports: [SmsLogService]
})
export class SmsLogModule {}
