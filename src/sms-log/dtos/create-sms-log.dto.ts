import { IsString } from 'class-validator';

export class CreateSmsLogDto {
  @IsString()
  SmsSid: string;

  @IsString()
  SmsStatus: string;

  @IsString()
  MessageStatus: string;

  @IsString()
  To: string;

  @IsString()
  From: string;

  @IsString()
  MessageSid: string;

  @IsString()
  AccountSid: string;
}
