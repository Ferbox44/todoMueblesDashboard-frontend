import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Project } from '../../../../services/service-details.service';
import { ProjectImage } from '../../../../services/service-details.service';
import { ImageItem, UploadService } from '../../../../services/upload.service';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-project-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent {
  @Input() project!: Project;
  @Output() update = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<string>();

  showImageSelector = false;
  currentImageType: 'material' | 'accessory' | 'main' | null = null;
  uploadedImages: ImageItem[] = [];
  selectedFile: File | null = null;
  isUploading = false;
  materialImages: ProjectImage[] = [];
  accessoryImages: ProjectImage[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uploadService: UploadService
  ) {}

  ngOnChanges() {
    if (this.project) {
      this.project.images = this.project.images || [];
      this.materialImages = this.project.images.filter(img => img.type === 'material');
      this.accessoryImages = this.project.images.filter(img => img.type === 'accessory');
    }
  }

  onImageSelect(image: { url: string }) {
    if (this.currentImageType) {
      this.project.images = this.project.images || [];
      this.project.images.push({
        url: image.url,
        type: this.currentImageType,
        title: this.currentImageType === 'material' ? 'Material' : 'Accessory'
      });
      this.showImageSelector = false;
      this.currentImageType = null;
    }
  }

  removeImage(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this image?',
      accept: () => {
        const imageType = this.project.images?.[index].type;
        if (imageType === 'material') {
          this.materialImages.splice(index, 1);
        } else if (imageType === 'accessory') {
          this.accessoryImages.splice(index, 1);
        }
        this.project.images?.splice(index, 1);
        this.saveChanges();
      }
    });
  }

  saveChanges() {
    if (!this.project.id) {
      // New project
      this.project.images = this.project.images || [];
      this.update.emit(this.project);
    } else {
      // Existing project
      this.project.images = this.project.images || [];
      this.update.emit(this.project);
    }
  }

  deleteProject() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar este proyecto?',
      accept: () => {
        this.delete.emit(this.project.id);
      }
    });
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

  selectImage(image: { url: string }) {
    if (!this.currentImageType) return;
    
    if (this.currentImageType === 'main') {
      this.project.image = image.url;
    } else if (this.currentImageType === 'material' || this.currentImageType === 'accessory') {
      this.project.images = this.project.images || [];
      this.project.images.push({
        url: image.url,
        type: this.currentImageType,
        title: this.currentImageType === 'material' ? 'Material' : 'Accessory'
      });
      
      // Update the corresponding image array
      if (this.currentImageType === 'material') {
        this.materialImages = this.project.images.filter(img => img.type === 'material');
      } else {
        this.accessoryImages = this.project.images.filter(img => img.type === 'accessory');
      }
    }
    this.showImageSelector = false;
    this.currentImageType = null;
  }

  openImageSelector(type: 'material' | 'accessory' | 'main') {
    this.currentImageType = type;
    this.showImageSelector = true;
    this.loadImages();
  }


  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        if (this.currentImageType === 'main') {
          this.project.image = response.url;
        } else if (this.currentImageType === 'material') {
          this.project.images?.push({
            url: response.url,
            type: 'material',
            title: 'Material'
          });
        } else if (this.currentImageType === 'accessory') {
          this.project.images?.push({
            url: response.url,
            type: 'accessory',
            title: 'Accesorio'
          });
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
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