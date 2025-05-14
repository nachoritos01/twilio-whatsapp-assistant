import { calendar_v3 } from 'googleapis';
export declare class GoogleCalendarService {
    private calendar;
    private authClient;
    private readonly SCOPES;
    private readonly TOKEN_PATH;
    private readonly CREDENTIALS_PATH;
    constructor();
    onModuleInit(): Promise<void>;
    private initializeGoogleCalendar;
    private loadSavedCredentialsIfExist;
    private saveCredentials;
    private authorize;
    listUpcomingEvents(): Promise<calendar_v3.Schema$Event[]>;
    listEvents(startDate: string, endDate: string): Promise<calendar_v3.Schema$Event[]>;
    createEvent(event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    updateEvent(eventId: string, event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event>;
    deleteEvent(eventId: string): Promise<void>;
    isTimeSlotAvailable(date: string, time: string): Promise<boolean>;
}
