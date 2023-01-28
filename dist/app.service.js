"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_twilio_1 = require("nestjs-twilio");
const sms_log_service_1 = require("./sms-log/sms-log.service");
let AppService = class AppService {
    constructor(twilioService, smsLogService) {
        this.twilioService = twilioService;
        this.smsLogService = smsLogService;
    }
    homeApi() {
        return {
            status: 200,
            message: "To send an SMS using Twilio, go to the '/send-sms' route."
        };
    }
    async sendSMS() {
        try {
            const smsResponse = await this.twilioService.client.messages.create({
                body: "Well, I woke up this mornin' and I got myself a beer. The future's uncertain and the end is always near!",
                from: process.env.TWILIO_PHONE_NUMBER,
                to: process.env.TEST_PHONE_NUMBER,
                statusCallback: `http://localhost:${process.env.PORT}/sms-callback`
            });
            return smsResponse;
        }
        catch (error) {
            const twilioErrorStatuses = [400, 404, 410];
            if (twilioErrorStatuses.includes(error.status)) {
                const { message, status, code, moreInfo } = error;
                return {
                    error: message,
                    status,
                    code,
                    moreInfo
                };
            }
            return {
                error: 'Something went wrong!',
                status: 500
            };
        }
    }
    async handleCallback(createSmsLogDto) {
        return this.smsLogService.create(createSmsLogDto);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_twilio_1.TwilioService,
        sms_log_service_1.SmsLogService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map