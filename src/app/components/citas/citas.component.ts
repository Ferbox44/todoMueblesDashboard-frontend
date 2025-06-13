import { Component, OnInit } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppointmentsService, Appointment } from '../../services/appointments.service';

type ProjectType = 'Cocina' | 'Clóset' | 'Vestidores' | 'Muebles de baño' | 'Diseño de interiores' | 'Otro';

interface Address {
  street: string;
  number: string;
  zipCode: string;
  neighborhood: string;
}

interface AppointmentFormData extends Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
  projectType: ProjectType;
  address: Address;
  requirements?: string;
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DatePickerModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class CitasComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedDate: Date = new Date();
  displayDialog: boolean = false;
  loading: boolean = false;
  
  projectTypes: ProjectType[] = [
    'Cocina',
    'Clóset',
    'Vestidores',
    'Muebles de baño',
    'Diseño de interiores',
    'Otro'
  ];

  newAppointment: AppointmentFormData = {
    name: '',
    email: '',
    phone: '',
    date: new Date(),
    time: '',
    projectType: 'Cocina',
    address: {
      street: '',
      number: '',
      zipCode: '',
      neighborhood: ''
    },
    message: ''
  };

  editingAppointmentId: string | null = null;

  constructor(
    private appointmentsService: AppointmentsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentsService.getAll().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las citas'
        });
        this.loading = false;
      }
    });
  }

  showDialog() {
    this.displayDialog = true;
  }

  editAppointment(appointment: Appointment) {
    this.editingAppointmentId = appointment.id || null;
    this.newAppointment = {
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      date: new Date(appointment.date),
      time: appointment.time,
      projectType: appointment.projectType,
      address: { ...appointment.address },
      message: appointment.message
    };
    this.displayDialog = true;
  }

  saveAppointment() {
    if (!this.validateAppointment()) {
      return;
    }

    this.loading = true;
    const appointmentData: Appointment = {
      ...this.newAppointment,
      status: 'Nuevo'
    };

    if (this.editingAppointmentId) {
      // Update existing appointment
      this.appointmentsService.update(this.editingAppointmentId, appointmentData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita actualizada correctamente'
          });
          this.displayDialog = false;
          this.resetNewAppointment();
          this.loadAppointments();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la cita'
          });
          this.loading = false;
        }
      });
    } else {
      // Create new appointment
      this.appointmentsService.create(appointmentData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cita agendada correctamente'
          });
          this.displayDialog = false;
          this.resetNewAppointment();
          this.loadAppointments();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al agendar la cita'
          });
          this.loading = false;
        }
      });
    }
  }

  private validateAppointment(): boolean {
    if (!this.newAppointment.name || !this.newAppointment.email || !this.newAppointment.phone || 
        !this.newAppointment.date || !this.newAppointment.time || !this.newAppointment.projectType ||
        !this.newAppointment.address.street || !this.newAppointment.address.number || 
        !this.newAppointment.address.zipCode || !this.newAppointment.address.neighborhood) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return false;
    }
    return true;
  }

  deleteAppointment(appointment: Appointment) {
    if (!appointment.id) return;
    
    this.loading = true;
    this.appointmentsService.delete(appointment.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cita eliminada correctamente'
        });
        this.loadAppointments();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error deleting appointment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la cita'
        });
        this.loading = false;
      }
    });
  }

  private resetNewAppointment() {
    this.newAppointment = {
      name: '',
      email: '',
      phone: '',
      date: new Date(),
      time: '',
      projectType: 'Cocina',
      address: {
        street: '',
        number: '',
        zipCode: '',
        neighborhood: ''
      },
      message: ''
    };
    this.editingAppointmentId = null;
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    if (!date) return [];
    return this.appointments.filter(appointment => 
      this.isSameDay(new Date(appointment.date), date)
    );
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  onDateSelect(event: Date) {
    if (event) {
      this.selectedDate = new Date(event);
    }
  }
}

