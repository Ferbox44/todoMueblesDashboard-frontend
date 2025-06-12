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
  currentVideoIndex: number = 0;
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
          detail: 'Failed to load videos'
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
          detail: 'Failed to load uploaded videos'
        });
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  openVideoSelector(index: number) {
    this.currentVideoIndex = index;
    this.showVideoSelector = true;
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.landingPageService.uploadMedia(this.selectedFile, 'video').subscribe({
        next: (response) => {
        this.videos[this.currentVideoIndex].url = response.url;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Video uploaded successfully'
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
            detail: 'Failed to upload video'
          });
        this.loading = false;
        }
      });
    }

  cancelUpload() {
    this.selectedFile = null;
  }

  selectVideo(video: VideoItem) {
    if (this.currentVideoIndex !== null) {
      this.videos[this.currentVideoIndex].url = video.url;
      this.videos[this.currentVideoIndex].title = video.title;
      this.videos[this.currentVideoIndex].description = video.description;
      this.showVideoSelector = false;
      this.currentVideoIndex = 0;
    }
  }

  removeVideo(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this video?',
      accept: () => {
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
        summary: 'Validation Error',
        detail: 'All videos must have a video file uploaded'
      });
      return;
    }

    this.saving = true;
    this.landingPageService.updateVideos(this.videos).subscribe({
      next: () => {
    this.update.emit(this.videos);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Videos updated successfully'
        });
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating videos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update videos'
        });
        this.saving = false;
      }
    });
  }
} 