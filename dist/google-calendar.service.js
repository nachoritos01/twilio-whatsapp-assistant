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
const fs = require("fs/promises");
const path = require("path");
const local_auth_1 = require("@google-cloud/local-auth");
let GoogleCalendarService = class GoogleCalendarService {
    constructor() {
        this.SCOPES = [
            'https://www.googleapis.com/auth/calendar.readonly'
        ];
        this.TOKEN_PATH = path.join(process.cwd(), 'token.json');
        this.CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
    }
    async onModuleInit() {
        console.log('Google Calendar Service initialized');
        await this.initializeGoogleCalendar();
    }
    async initializeGoogleCalendar() {
        this.authClient = await this.authorize();
        console.log(this.authClient);
        this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.authClient });
    }
    async loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(this.TOKEN_PATH, 'utf-8');
            const credentials = JSON.parse(content);
            return googleapis_1.google.auth.fromJSON(credentials);
        }
        catch (err) {
            console.error('Error loading saved credentials:', err);
            return null;
        }
    }
    async saveCredentials(client) {
        const content = await fs.readFile(this.CREDENTIALS_PATH, 'utf-8');
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token
        });
        await fs.writeFile(this.TOKEN_PATH, payload);
    }
    async authorize() {
        try {
            let client = await this.loadSavedCredentialsIfExist();
            if (client) {
                return client;
            }
            client = (await (0, local_auth_1.authenticate)({
                keyfilePath: this.CREDENTIALS_PATH,
                scopes: this.SCOPES
            }));
            if (client.credentials) {
                await this.saveCredentials(client);
            }
            return client;
        }
        catch (error) {
            console.error('Error during authorization:', error);
            throw new Error('Authorization failed. Please check your credentials and token.');
        }
    }
    async listUpcomingEvents() {
        const res = await this.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        });
        const events = res.data.items || [];
        if (events.length === 0) {
            console.log('No upcoming events found.');
        }
        else {
            console.log('Upcoming 10 events:');
            events.forEach((event) => {
                var _a, _b;
                const start = ((_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime) || ((_b = event.start) === null || _b === void 0 ? void 0 : _b.date);
                console.log(`${start} - ${event.summary}`);
            });
        }
        return events;
    }
    async listEvents(startDate, endDate) {
        const response = await this.calendar.events.list({
            calendarId: 'primary',
            timeMin: startDate,
            timeMax: endDate,
            singleEvents: true,
            orderBy: 'startTime'
        });
        return response.data.items || [];
    }
    async createEvent(event) {
        const response = await this.calendar.events.insert({
            calendarId: 'primary',
            requestBody: event
        });
        return response.data;
    }
    async updateEvent(eventId, event) {
        const response = await this.calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: event
        });
        return response.data;
    }
    async deleteEvent(eventId) {
        await this.calendar.events.delete({
            calendarId: 'primary',
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
};
GoogleCalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleCalendarService);
exports.GoogleCalendarService = GoogleCalendarService;
//# sourceMappingURL=google-calendar.service.js.map