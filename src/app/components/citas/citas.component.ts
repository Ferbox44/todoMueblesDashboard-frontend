import { Component, OnInit } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

type ProjectType = 'Cocina' | 'Clóset' | 'Vestidores' | 'Muebles de baño' | 'Diseño de interiores' | 'Otro';

interface Address {
  street: string;
  number: string;
  zipCode: string;
  neighborhood: string;
}

interface Appointment {
  id: number;
  personalData: {
    fullName: string;
    phone: string;
    email: string;
  };
  projectType: ProjectType;
  address: Address;
  date: Date;
  time: string;
  requirements?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
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
    DropdownModule
  ]
})

export class CitasComponent implements OnInit {

  appointments: Appointment[] = [];
  selectedDate: Date = new Date();
  displayDialog: boolean = false;
  projectTypes: ProjectType[] = [
    'Cocina',
    'Clóset',
    'Vestidores',
    'Muebles de baño',
    'Diseño de interiores',
    'Otro'
  ];
  

  newAppointment: Appointment = {
    id: 0,
    personalData: {
      fullName: '',
      phone: '',
      email: ''
    },
    projectType: 'Cocina',
    address: {
      street: '',
      number: '',
      zipCode: '',
      neighborhood: ''
    },
    date: new Date(),
    time: '',
    status: 'scheduled'
  };

  ngOnInit() {
    // Mock data for development
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    this.appointments = [
      {
        id: 1,
        personalData: {
          fullName: 'Juan Pérez',
          phone: '555-0123',
          email: 'juan@email.com'
        },
        projectType: 'Cocina',
        address: {
          street: 'Av. Reforma',
          number: '123',
          zipCode: '06500',
          neighborhood: 'Centro'
        },
        date: new Date(today),
        time: '10:00',
        status: 'scheduled',
        requirements: 'Diseño de cocina integral con isla'
      },
      {
        id: 2,
        personalData: {
          fullName: 'María García',
          phone: '555-0124',
          email: 'maria@email.com'
        },
        projectType: 'Clóset',
        address: {
          street: 'Calle Juárez',
          number: '456',
          zipCode: '06600',
          neighborhood: 'Roma'
        },
        date: new Date(tomorrow),
        time: '15:30',
        status: 'scheduled',
        requirements: 'Clóset walk-in con espejo'
      }
    ];

    // Set initial selected date to today
    this.selectedDate = new Date(today);
  }

  showDialog() {
    this.displayDialog = true;
  }

  saveAppointment() {
    if (this.newAppointment.id === 0) {
      // Add new appointment
      this.newAppointment.id = this.appointments.length + 1;
      this.appointments.push({...this.newAppointment});
    } else {
      // Update existing appointment
      const index = this.appointments.findIndex(a => a.id === this.newAppointment.id);
      if (index !== -1) {
        this.appointments[index] = {...this.newAppointment};
      }
    }
    this.displayDialog = false;
    this.resetNewAppointment();
  }

  editAppointment(appointment: Appointment) {
    this.newAppointment = {...appointment};
    this.displayDialog = true;
  }

  deleteAppointment(appointment: Appointment) {
    this.appointments = this.appointments.filter(a => a.id !== appointment.id);
  }

  private resetNewAppointment() {
    this.newAppointment = {
      id: 0,
      personalData: {
        fullName: '',
        phone: '',
        email: ''
      },
      projectType: 'Cocina',
      address: {
        street: '',
        number: '',
        zipCode: '',
        neighborhood: ''
      },
      date: new Date(),
      time: '',
      status: 'scheduled'
    };
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    if (!date) return [];
    return this.appointments.filter(appointment => 
      this.isSameDay(appointment.date, date)
    );
  }

  getDatesWithAppointments(): Date[] {
    return this.appointments.map(appointment => appointment.date);
  }

  hasAppointmentOnDate(date: Date): boolean {
    if (!date) return false;
    return this.appointments.some(appointment => 
      this.isSameDay(appointment.date, date)
    );
  }

  isSelectedDate(date: Date): boolean {
    if (!date) return false;
    return this.isSameDay(this.selectedDate, date);
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

