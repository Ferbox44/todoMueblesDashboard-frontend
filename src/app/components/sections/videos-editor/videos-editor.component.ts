import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingPageService } from '../../../services/landing-page.service';
import { MessageService } from 'primeng/api';
import { LandingPageSection, VideoItem } from '../../../interfaces/landing-page.interface';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-videos-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    DialogModule,
    ToastModule,
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './videos-editor.component.html',
  styleUrls: ['./videos-editor.component.scss']
})
export class VideosEditorComponent implements OnInit {
  @Input() videos: VideoItem[] = [];
  @Output() update = new EventEmitter<VideoItem[]>();
  loading = false;
  saving = false;
  showVideoSelector = false;
  currentVideoIndex: number | null = null;
  selectedFile: File | null = null;
  uploadedVideos: VideoItem[] = [];

  constructor(
    private landingPageService: LandingPageService,
    private uploadService: UploadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    if (this.videos.length === 0) {
      this.loadVideos();
    } else {
      // Ensure we always have exactly 4 videos
      while (this.videos.length < 4) {
        this.videos.push({ title: '', description: '', url: '' });
      }
    }
    this.loadUploadedVideos();
  }

  loadVideos() {
    this.loading = true;
    this.landingPageService.getLandingPageContent().subscribe({
      next: (data) => {
        this.videos = data.content.videos || [];
        // Ensure we always have exactly 4 videos
        while (this.videos.length < 4) {
          this.videos.push({ title: '', description: '', url: '' });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los videos'
        });
        this.loading = false;
      }
    });
  }

  loadUploadedVideos() {
    this.uploadService.listVideos().subscribe({
      next: (response) => {
        this.uploadedVideos = response.videos;
      },
      error: (error) => {
        console.error('Error loading uploaded videos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los videos subidos'
        });
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  openVideoSelector(index: number) {
    console.log('Opening video selector for index:', index);
    console.log('Current videos state:', this.videos);
    this.currentVideoIndex = index;
    this.showVideoSelector = true;
  }

  selectVideo(video: VideoItem) {
    if (this.currentVideoIndex !== null) {
      // Directly update the video at the current index
      this.videos[this.currentVideoIndex] = {
        ...this.videos[this.currentVideoIndex],
        url: video.url
      };
      this.showVideoSelector = false;
      this.currentVideoIndex = null;
    }
  }

  uploadSelectedFile() {
    if (!this.selectedFile || this.currentVideoIndex === null) return;

    this.loading = true;
    this.landingPageService.uploadMedia(this.selectedFile, 'video').subscribe({
      next: (response) => {
        // Directly update the video at the current index
        this.videos[this.currentVideoIndex!] = {
          ...this.videos[this.currentVideoIndex!],
          url: response.url
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Video subido correctamente'
        });
        this.loading = false;
        this.selectedFile = null;
        this.loadUploadedVideos();
      },
      error: (error) => {
        console.error('Error uploading video:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir el video'
        });
        this.loading = false;
      }
    });
  }

  cancelUpload() {
    this.selectedFile = null;
  }

  removeVideo(index: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar este video?',
      accept: () => {
        // Directly update the video at the index
        this.videos[index] = { title: '', description: '', url: '' };
      }
    });
  }

  saveChanges() {
    // Validate that all required fields are filled
    const invalidVideos = this.videos.filter(video => !video.url);
    if (invalidVideos.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Todos los videos deben tener un archivo de video subido'
      });
      return;
    }

    this.saving = true;
    this.landingPageService.updateVideos(this.videos).subscribe({
      next: () => {
        this.update.emit(this.videos);
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Videos actualizados correctamente'
        });
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating videos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar los videos'
        });
        this.saving = false;
      }
    });
  }
} 