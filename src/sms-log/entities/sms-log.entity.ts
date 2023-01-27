import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SmsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  SmsSid: string;

  @Column()
  SmsStatus: string;

  @Column()
  MessageStatus: string;

  @Column()
  To: string;

  @Column()
  From: string;

  @Column()
  MessageSid: string;

  @Column()
  AccountSid: string;
}
