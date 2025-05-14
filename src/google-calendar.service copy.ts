import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: '../credentials.json', // Ruta al archivo JSON de la cuenta de servicio
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  /**
   * Lista todos los eventos en un rango de fechas.
   * @param startDate Fecha de inicio (ISO string).
   * @param endDate Fecha de fin (ISO string).
   * @returns Lista de eventos.
   */
  async listEvents(
    startDate: string,
    endDate: string
  ): Promise<calendar_v3.Schema$Event[]> {
    const calendarId = 'primary'; // O usa un ID de calendario específico
    const response = await this.calendar.events.list({
      calendarId,
      timeMin: startDate,
      timeMax: endDate,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.data.items || [];
  }

  /**
   * Obtiene un evento específico por su ID.
   * @param eventId ID del evento.
   * @returns Detalles del evento.
   */
  async getEvent(eventId: string): Promise<calendar_v3.Schema$Event> {
    const calendarId = 'primary';
    const response = await this.calendar.events.get({
      calendarId,
      eventId
    });

    return response.data;
  }

  /**
   * Crea un nuevo evento en Google Calendar.
   * @param event Datos del evento.
   * @returns Evento creado.
   */
  async createEvent(
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    const calendarId = 'primary';
    const response = await this.calendar.events.insert({
      calendarId,
      requestBody: event
    });

    return response.data;
  }

  /**
   * Actualiza un evento existente en Google Calendar.
   * @param eventId ID del evento a actualizar.
   * @param event Datos actualizados del evento.
   * @returns Evento actualizado.
   */
  async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event> {
    const calendarId = 'primary';
    const response = await this.calendar.events.update({
      calendarId,
      eventId,
      requestBody: event
    });

    return response.data;
  }

  /**
   * Elimina un evento de Google Calendar.
   * @param eventId ID del evento a eliminar.
   */
  async deleteEvent(eventId: string): Promise<void> {
    const calendarId = 'primary';
    await this.calendar.events.delete({
      calendarId,
      eventId
    });
  }

  /**
   * Verifica si un horario está disponible.
   * @param date Fecha en formato ISO (YYYY-MM-DD).
   * @param time Hora en formato HH:mm.
   * @returns `true` si el horario está disponible, `false` si está ocupado.
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

  /**
   * Obtiene una lista de horarios disponibles en un día.
   * @param date Fecha en formato ISO (YYYY-MM-DD).
   * @returns Lista de horarios disponibles.
   */
  async getAvailableTimeSlots(date: string): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await this.listEvents(
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );
    const workingHours = { start: 9, end: 17 }; // Horario laboral: 9am - 5pm
    const timeSlots: string[] = [];

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const requestedTime = new Date(`${date}T${time}:00`);

      let isAvailable = true;
      for (const event of events) {
        const eventStart = new Date(
          event.start?.dateTime || event.start?.date || ''
        );
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

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
}
