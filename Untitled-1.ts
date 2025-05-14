import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import * as fs from 'fs/promises';
import * as path from 'path';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private authClient: OAuth2Client;

  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];
  private readonly TOKEN_PATH = path.join(process.cwd(), 'token.json');
  private readonly CREDENTIALS_PATH = path.join(
    process.cwd(),
    '../credentials.json'
  );

  constructor() {}

  async onModuleInit() {
    await this.initializeGoogleCalendar();
  }

  /**
   * Inicializa el cliente de Google Calendar con autenticación.
   */
  private async initializeGoogleCalendar() {
    this.authClient = await this.authorize();
    this.calendar = google.calendar({ version: 'v3', auth: this.authClient });
  }

  /**
   * Lee las credenciales previamente autorizadas desde el archivo token.json.
   */
  private async loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
      const content = await fs.readFile(this.TOKEN_PATH, 'utf-8');
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
      console.error('Error loading saved credentials:', err);
      return null;
    }
  }

  /**
   * Guarda las credenciales autorizadas en el archivo token.json.
   */
  private async saveCredentials(client: OAuth2Client): Promise<void> {
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

  /**
   * Autoriza al cliente de Google Calendar.
   */
  private async authorize(): Promise<OAuth2Client> {
    try {
      let client = await this.loadSavedCredentialsIfExist();
      if (client) {
        return client;
      }
      client = (await google.auth.getClient({
        keyFile: this.CREDENTIALS_PATH,
        scopes: this.SCOPES
      })) as unknown as OAuth2Client;
      if (client.credentials) {
        await this.saveCredentials(client);
      }
      return client;
    } catch (error) {
      console.error('Error during authorization:', error);
      throw new Error(
        'Authorization failed. Please check your credentials and token.'
      );
    }
  }

  /**
   * Lista los próximos 10 eventos en el calendario principal del usuario.
   */
  async listUpcomingEvents(): Promise<calendar_v3.Schema$Event[]> {
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
    } else {
      console.log('Upcoming 10 events:');
      events.forEach((event) => {
        const start = event.start?.dateTime || event.start?.date;
        console.log(`${start} - ${event.summary}`);
      });
    }
    return events;
  }

  /**
   * Lista todos los eventos en un rango de fechas.
   */
  async listEvents(
    startDate: string,
    endDate: string
  ): Promise<calendar_v3.Schema$Event[]> {
    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate,
      timeMax: endDate,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.data.items || [];
  }

  /**
   * Crea un nuevo evento en Google Calendar.
   */
  async createEvent(
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event
    });

    return response.data;
  }

  /**
   * Actualiza un evento existente en Google Calendar.
   */
  async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    const response = await this.calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: event
    });

    return response.data;
  }

  /**
   * Elimina un evento de Google Calendar.
   */
  async deleteEvent(eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: 'primary',
      eventId
    });
  }

  /**
   * Verifica si un horario está disponible.
   */
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await this.listEvents(
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );
    const requestedTime = new Date(`${date}T${time}:00`);

    for (const event of events) {
      const eventStart = new Date(
        event.start?.dateTime || event.start?.date || ''
      );
      const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

      if (requestedTime >= eventStart && requestedTime < eventEnd) {
        return false; // El horario solicitado ya está ocupado
      }
    }

    return true; // El horario está disponible
  }
}
