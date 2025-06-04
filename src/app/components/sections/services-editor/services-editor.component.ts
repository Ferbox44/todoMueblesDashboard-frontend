import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LandingPageContent, ServiceCard } from '../../../interfaces/landing-page.interface';
import { LandingPageService } from '../../../services/landing-page.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-services-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './services-editor.component.html',
  styleUrls: ['./services-editor.component.scss'],
  providers: [MessageService]
})
export class ServicesEditorComponent {
  @Input() services!: LandingPageContent['servicesCarousel'];
  @Output() update = new EventEmitter<LandingPageContent['servicesCarousel']>();

  constructor(
    private landingPageService: LandingPageService,
    private messageService: MessageService
  ) {}

  onImageUpload(event: any, service: ServiceCard) {
    const file = event.files[0];
    if (file) {
      this.landingPageService.uploadMedia(file, 'image').subscribe({
        next: (response) => {
          service.image = response.url;
          this.update.emit(this.services);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service image uploaded successfully'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload service image'
          });
        }
      });
    }
  }

  onServiceChange() {
    this.update.emit(this.services);
  }

  addService() {
    const newService: ServiceCard = {
      id: Date.now().toString(),
      title: 'New Service',
      image: '',
      link: ''
    };
    this.services.push(newService);
    this.update.emit(this.services);
  }

  removeService(index: number) {
    this.services.splice(index, 1);
    this.update.emit(this.services);
  }
} 