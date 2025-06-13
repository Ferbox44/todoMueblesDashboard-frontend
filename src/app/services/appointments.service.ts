import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ProjectType = 'Cocina' | 'Clóset' | 'Vestidores' | 'Muebles de baño' | 'Diseño de interiores' | 'Otro';

export interface Address {
  street: string;
  number: string;
  zipCode: string;
  neighborhood: string;
}

export interface Appointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  message?: string;
  status?: string;
  projectType: ProjectType;
  address: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  update(id: string, appointment: Partial<Appointment>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, appointment);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 