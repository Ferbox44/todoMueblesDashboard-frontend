import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-brands-editor',
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
    ConfirmDialogModule
  ],
  providers: [MessageService],
  templateUrl: './brands-editor.component.html',
  styleUrls: ['./brands-editor.component.scss']
})
export class BrandsEditorComponent implements OnInit {
  @Input() brands!: LandingPageContent['brandsCarousel'];
  @Output() update = new EventEmitter<LandingPageContent['brandsCarousel']>();

  loading = false;
  saving = false;
  showImageSelector = false;
  currentBrandIndex: number = 0;
  selectedFile: File | null = null;
  uploadedImages: ImageItem[] = [];
  selectedBrandIndex: number | null = null;

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

  onFileSelect(event: any, index: number) {
    this.selectedFile = event.files[0];
    this.currentBrandIndex = index;
  }

  openImageSelector(index: number) {
    this.currentBrandIndex = index;
    this.showImageSelector = true;
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.landingPageService.uploadMedia(this.selectedFile, 'image').subscribe({
        next: (response) => {
        this.brands[this.currentBrandIndex].image = response.url;
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
    if (this.currentBrandIndex !== null) {
      this.brands[this.currentBrandIndex].image = image.url;
      this.showImageSelector = false;
    }
  }

  addBrand() {
    this.brands.push({
      id: '',
      name: '',
      logo: '',
      image: ''
    });
  }

  removeBrand(index: number) {
    this.brands.splice(index, 1);
  }

  saveChanges() {
    if (this.brands.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, agregue al menos una marca'
      });
      return;
    }

    // Validate all brands have required fields
    const invalidBrand = this.brands.find(brand => !brand.name || !brand.image);
    if (invalidBrand) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todas las marcas deben tener un nombre y una imagen'
      });
      return;
    }

    // Clean up brand data before sending
    const cleanedBrands = this.brands.map(brand => ({
      name: brand.name,
      image: brand.image,
      logo: brand.logo || brand.image // Use image as logo if not specified
    }));

    this.saving = true;
    this.landingPageService.updateBrandsCarousel(cleanedBrands)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Sección de marcas actualizada correctamente'
          });
          this.saving = false;
        },
        error: (error: Error) => {
          console.error('Error updating brands section:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la sección de marcas'
          });
          this.saving = false;
        }
      });
  }
} 