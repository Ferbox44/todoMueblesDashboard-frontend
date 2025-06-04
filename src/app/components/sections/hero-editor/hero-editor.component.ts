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
          detail: 'Failed to load images'
        });
      }
    });
  }

  openImageSelector(type: 'logo' | 'background') {
    this.currentImageType = type;
    this.showImageSelector = true;
    this.loadImages(); // Refresh the image list
  }

  selectImage(image: ImageItem) {
    if (this.currentImageType === 'logo') {
      this.heroContent.logo = image.url;
    } else if (this.currentImageType === 'background') {
      this.heroContent.backgroundImage = image.url;
    }
    this.showImageSelector = false;
    this.saveChanges();
  }

  saveChanges() {
    this.landingPageService.updateHeroSection(this.heroContent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Hero section updated successfully'
        });
        this.update.emit(this.heroContent);
      },
      error: (error) => {
        console.error('Error updating hero section:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update hero section'
        });
      }
    });
  }

  onLogoUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.heroContent.logo = response.url;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logo uploaded successfully'
          });
          this.loadImages(); // Refresh the image list
          this.saveChanges();
        },
        error: (error) => {
          console.error('Error uploading logo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload logo'
          });
        }
      });
    }
  }

  onBackgroundUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.heroContent.backgroundImage = response.url;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Background image uploaded successfully'
          });
          this.loadImages(); // Refresh the image list
          this.saveChanges();
        },
        error: (error) => {
          console.error('Error uploading background:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload background image'
          });
        }
      });
    }
  }
} 