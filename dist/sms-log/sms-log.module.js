"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsLogModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sms_log_entity_1 = require("./entities/sms-log.entity");
const sms_log_service_1 = require("./sms-log.service");
let SmsLogModule = class SmsLogModule {
};
SmsLogModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sms_log_entity_1.SmsLog])],
        providers: [sms_log_service_1.SmsLogService],
        exports: [sms_log_service_1.SmsLogService]
    })
], SmsLogModule);
exports.SmsLogModule = SmsLogModule;
//# sourceMappingURL=sms-log.module.js.map