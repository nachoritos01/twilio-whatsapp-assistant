import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TwilioModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          useFactory: (configService: ConfigService) => ({
            accountSid: configService.get('TWILIO_ACCOUNT_SID'),
            authToken: configService.get('TWILIO_AUTH_TOKEN')
          }),
          inject: [ConfigService]
        })
      ],
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return status 200.', () => {
      expect(appController.homeApi().status).toBe(200);
      expect(appController.homeApi().message).toBe(
        "To send an SMS using Twilio, go to the '/send-sms' route."
      );
    });
  });
});
