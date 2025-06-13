import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LandingPageContent, ServiceCard } from '../../../interfaces/landing-page.interface';
import { LandingPageService } from '../../../services/landing-page.service';
import { UploadService, ImageItem } from '../../../services/upload.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';

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
    CardModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    DialogModule,
    ImageModule
  ],
  templateUrl: './services-editor.component.html',
  styleUrls: ['./services-editor.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ServicesEditorComponent {
  @Input() services!: LandingPageContent['servicesCarousel'];
  @Output() update = new EventEmitter<LandingPageContent['servicesCarousel']>();

  loading = false;
  saving = false;
  uploadedImages: ImageItem[] = [];
  showImageSelector = false;
  currentServiceIndex: number = 0;
  selectedFile: File | null = null;
  isUploading = false;
  currentImageType: 'image' | null = null;


  constructor(
    private landingPageService: LandingPageService,
    private uploadService: UploadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.uploadService.listImages().subscribe({
      next: (response) => {
        this.uploadedImages = response.images;
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las imágenes'
        });
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  onImageUpload(event: any, service: ServiceCard) {
    const file = event.files[0];
    if (file) {
      this.loading = true;
      this.landingPageService.uploadMedia(file, 'image').subscribe({
        next: (response) => {
          service.image = response.url;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service image uploaded successfully'
          });
          this.loading = false;
          this.loadImages(); // Refresh the image list
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload service image'
          });
          this.loading = false;
        }
      });
    }
  }

  openImageSelector(index: number) {
    this.currentServiceIndex = index;
    this.showImageSelector = true;
  }
  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
        if (this.currentImageType === 'image') {
          this.services[this.currentServiceIndex].image = response.url;
        }
        
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
          detail: 'Image uploaded successfully'
          });
        
        this.loadImages();
        this.selectedFile = null;
        this.isUploading = false;
        },
        error: (error) => {
        console.error('Error uploading file:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
          detail: 'Failed to upload image'
          });
        this.isUploading = false;
        }
      });
    }

  cancelUpload() {
    this.selectedFile = null;
  }

  selectImage(image: ImageItem) {
    if (this.currentServiceIndex !== null) {
      this.services[this.currentServiceIndex].image = image.url;
      this.showImageSelector = false;
      this.currentServiceIndex = 0;
    }
  }

  onServiceChange() {
    // Validate service data
    const invalidServices = this.services.filter(service => !service.title || !service.image);
    if (invalidServices.length < 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor complete todos los campos requeridos para cada servicio'
      });
    }
  }

  addService() {
    const newService: ServiceCard = {
      title: 'New Service',
      image: '',
      link: ''
    };
    this.services.push(newService);
  }

  removeService(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this service?',
      accept: () => {
    this.services.splice(index, 1);
        this.saveChanges();
      }
    });
  }

  saveChanges() {
    const invalidServices = this.services.filter(service => !service.title || !service.image);
    if (invalidServices.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields before saving'
      });
      return;
    }

    this.saving = true;
    this.landingPageService.updateServicesCarousel(this.services).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Services updated successfully'
        });
        this.saving = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update services'
        });
        this.saving = false;
      }
    });
  }
} 