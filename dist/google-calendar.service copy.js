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
exports.GoogleCalendarService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
let GoogleCalendarService = class GoogleCalendarService {
    constructor() {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: '../credentials.json',
            scopes: ['https://www.googleapis.com/auth/calendar']
        });
        this.calendar = googleapis_1.google.calendar({ version: 'v3', auth });
    }
    async listEvents(startDate, endDate) {
        const calendarId = 'primary';
        const response = await this.calendar.events.list({
            calendarId,
            timeMin: startDate,
            timeMax: endDate,
            singleEvents: true,
            orderBy: 'startTime'
        });
        return response.data.items || [];
    }
    async getEvent(eventId) {
        const calendarId = 'primary';
        const response = await this.calendar.events.get({
            calendarId,
            eventId
        });
        return response.data;
    }
    async createEvent(event) {
        const calendarId = 'primary';
        const response = await this.calendar.events.insert({
            calendarId,
            requestBody: event
        });
        return response.data;
    }
    async updateEvent(eventId, event) {
        const calendarId = 'primary';
        const response = await this.calendar.events.update({
            calendarId,
            eventId,
            requestBody: event
        });
        return response.data;
    }
    async deleteEvent(eventId) {
        const calendarId = 'primary';
        await this.calendar.events.delete({
            calendarId,
            eventId
        });
    }
    async isTimeSlotAvailable(date, time) {
        var _a, _b, _c, _d;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const events = await this.listEvents(startOfDay.toISOString(), endOfDay.toISOString());
        const requestedTime = new Date(`${date}T${time}:00`);
        for (const event of events) {
            const eventStart = new Date(((_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime) || ((_b = event.start) === null || _b === void 0 ? void 0 : _b.date) || '');
            const eventEnd = new Date(((_c = event.end) === null || _c === void 0 ? void 0 : _c.dateTime) || ((_d = event.end) === null || _d === void 0 ? void 0 : _d.date) || '');
            if (requestedTime >= eventStart && requestedTime < eventEnd) {
                return false;
            }
        }
        return true;
    }
    async getAvailableTimeSlots(date) {
        var _a, _b, _c, _d;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const events = await this.listEvents(startOfDay.toISOString(), endOfDay.toISOString());
        const workingHours = { start: 9, end: 17 };
        const timeSlots = [];
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            const requestedTime = new Date(`${date}T${time}:00`);
            let isAvailable = true;
            for (const event of events) {
                const eventStart = new Date(((_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime) || ((_b = event.start) === null || _b === void 0 ? void 0 : _b.date) || '');
                const eventEnd = new Date(((_c = event.end) === null || _c === void 0 ? void 0 : _c.dateTime) || ((_d = event.end) === null || _d === void 0 ? void 0 : _d.date) || '');
                if (requestedTime >= eventStart && requestedTime < eventEnd) {
                    isAvailable = false;
                    break;
                }
            }
            if (isAvailable) {
                timeSlots.push(time);
            }
        }
        return timeSlots;
    }
};
GoogleCalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleCalendarService);
exports.GoogleCalendarService = GoogleCalendarService;
//# sourceMappingURL=google-calendar.service%20copy.js.map