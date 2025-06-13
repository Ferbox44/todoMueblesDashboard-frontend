import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingPageService } from '../../../services/landing-page.service';
import { MessageService } from 'primeng/api';
import { LandingPageContent } from '../../../interfaces/landing-page.interface';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { UploadService, ImageItem } from '../../../services/upload.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-compare-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
    FileUploadModule,
    DialogModule,
    ImageModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './compare-editor.component.html',
  styleUrls: ['./compare-editor.component.scss']
})
export class CompareEditorComponent {
  @Input() compareSection!: LandingPageContent['compareSection'];
  @Output() update = new EventEmitter<LandingPageContent['compareSection']>();

  loading = false;
  saving = false;
  showImageSelector = false;
  currentImageType: 'before' | 'after' = 'before';
  selectedFile: File | null = null;
  uploadedImages: ImageItem[] = [];

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

  onFileSelect(event: any, type: 'before' | 'after') {
    this.selectedFile = event.files[0];
    this.currentImageType = type;
  }

  openImageSelector(type: 'before' | 'after') {
    this.currentImageType = type;
    this.showImageSelector = true;
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.landingPageService.uploadMedia(this.selectedFile, 'image').subscribe({
        next: (response) => {
        if (this.currentImageType === 'before') {
          this.compareSection.beforeImage = response.url;
        } else {
          this.compareSection.afterImage = response.url;
        }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
          detail: 'Imagen subida correctamente'
          });
        this.loading = false;
        this.selectedFile = null;
        this.loadImages();
        },
      error: (error) => {
        console.error('Error uploading image:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
          detail: 'Error al subir la imagen'
          });
        this.loading = false;
        }
      });
    }

  cancelUpload() {
    this.selectedFile = null;
  }

  selectImage(image: ImageItem) {
    if (this.currentImageType === 'before') {
      this.compareSection.beforeImage = image.url;
    } else {
      this.compareSection.afterImage = image.url;
    }
    this.showImageSelector = false;
  }

  saveChanges() {
    this.saving = true;
    this.landingPageService.updateCompareSection(this.compareSection).subscribe({
      next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
          detail: 'Sección de comparación actualizada correctamente'
          });
        this.saving = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
          detail: 'Error al actualizar la sección de comparación'
          });
        this.saving = false;
        }
      });
  }

  onTitleChange() {
    this.update.emit(this.compareSection);
  }
} 