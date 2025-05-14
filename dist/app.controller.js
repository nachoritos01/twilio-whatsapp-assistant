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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const create_sms_log_dto_1 = require("./sms-log/dtos/create-sms-log.dto");
const google_calendar_service_1 = require("./google-calendar.service");
let AppController = class AppController {
    constructor(appService, calendar) {
        this.appService = appService;
        this.calendar = calendar;
    }
    homeApi() {
        return this.appService.homeApi();
    }
    async listEventsCalendar() {
        return await this.calendar.listUpcomingEvents();
    }
    sendSMS() {
        return this.appService.sendSMS();
    }
    sendWhatsapp() {
        return this.appService.sendWhatsapp();
    }
    async replyToWhatsapp(body) {
        return this.appService.replyToWhatsapp(body);
    }
    handleCallback(body) {
        return this.appService.handleCallback(body);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "homeApi", null);
__decorate([
    (0, common_1.Get)('/list-events-calendar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "listEventsCalendar", null);
__decorate([
    (0, common_1.Get)('/send-sms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendSMS", null);
__decorate([
    (0, common_1.Get)('/send-whatsapp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendWhatsapp", null);
__decorate([
    (0, common_1.Post)('/whatsapp-reply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "replyToWhatsapp", null);
__decorate([
    (0, common_1.Post)('/sms-callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sms_log_dto_1.CreateSmsLogDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "handleCallback", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        google_calendar_service_1.GoogleCalendarService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map