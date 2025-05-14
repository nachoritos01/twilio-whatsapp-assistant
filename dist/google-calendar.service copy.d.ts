import { calendar_v3 } from 'googleapis';
export declare class GoogleCalendarService {
    private calendar;
    constructor();
    listEvents(startDate: string, endDate: string): Promise<calendar_v3.Schema$Event[]>;
    getEvent(eventId: string): Promise<calendar_v3.Schema$Event>;
    createEvent(event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    updateEvent(eventId: string, event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    deleteEvent(eventId: string): Promise<void>;
    isTimeSlotAvailable(date: string, time: string): Promise<boolean>;
    getAvailableTimeSlots(date: string): Promise<string[]>;
}
