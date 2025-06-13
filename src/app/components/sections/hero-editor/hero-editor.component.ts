import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LandingPageContent } from '../../../interfaces/landing-page.interface';
import { LandingPageService } from '../../../services/landing-page.service';
import { UploadService, ImageItem } from '../../../services/upload.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-hero-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ImageModule
  ],
  templateUrl: './hero-editor.component.html',
  styleUrls: ['./hero-editor.component.scss'],
  providers: [MessageService]
})
export class HeroEditorComponent implements OnInit {
  @Input() heroContent!: LandingPageContent['hero'];
  @Output() update = new EventEmitter<LandingPageContent['hero']>();

  uploadedImages: ImageItem[] = [];
  showImageSelector = false;
  currentImageType: 'logo' | 'background' | null = null;
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    private landingPageService: LandingPageService,
    private uploadService: UploadService,
    private messageService: MessageService
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

  openImageSelector(type: 'logo' | 'background') {
    this.currentImageType = type;
    this.showImageSelector = true;
    this.loadImages();
  }

  selectImage(image: ImageItem) {
    if (this.currentImageType === 'logo') {
      this.heroContent.logo = image.url;
    } else if (this.currentImageType === 'background') {
      this.heroContent.backgroundImage = image.url;
    }
    this.showImageSelector = false;
    //this.saveChanges();
  }

  saveChanges() {
    this.landingPageService.updateHeroSection(this.heroContent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Sección actualizada correctamente'
        });
        this.update.emit(this.heroContent);
      },
      error: (error) => {
        console.error('Error updating hero section:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la sección'
        });
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
        if (this.currentImageType === 'logo') {
          this.heroContent.logo = response.url;
        } else if (this.currentImageType === 'background') {
          this.heroContent.backgroundImage = response.url;
        }
        
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
          detail: 'Imagen subida correctamente'
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
          detail: 'Error al subir la imagen'
          });
        this.isUploading = false;
        }
      });
    }

  cancelUpload() {
    this.selectedFile = null;
  }
} 