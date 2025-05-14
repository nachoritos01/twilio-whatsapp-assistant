"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const nestjs_twilio_1 = require("nestjs-twilio");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const sms_log_entity_1 = require("./sms-log/entities/sms-log.entity");
const sms_log_module_1 = require("./sms-log/sms-log.module");
const core_1 = require("@nestjs/core");
const google_calendar_service_1 = require("./google-calendar.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            nestjs_twilio_1.TwilioModule.forRootAsync({
                inject: [config_1.ConfigService],
                imports: [config_1.ConfigModule.forRoot()],
                useFactory: (configService) => ({
                    accountSid: configService.get('TWILIO_ACCOUNT_SID'),
                    authToken: configService.get('TWILIO_AUTH_TOKEN')
                })
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    return {
                        type: 'sqlite',
                        database: config.get('DB_NAME') || 'db.sqlite',
                        synchronize: true,
                        entities: [sms_log_entity_1.SmsLog]
                    };
                }
            }),
            sms_log_module_1.SmsLogModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            google_calendar_service_1.GoogleCalendarService,
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    whitelist: true
                })
            }
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map