import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoItem } from '../../../interfaces/landing-page.interface';
import { LandingPageService } from '../../../services/landing-page.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-videos-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadModule, ToastModule],
  templateUrl: './videos-editor.component.html',
  styleUrls: ['./videos-editor.component.scss'],
  providers: [MessageService]
})
export class VideosEditorComponent {
  @Input() videos!: VideoItem[];
  @Output() update = new EventEmitter<VideoItem[]>();

  constructor(
    private landingPageService: LandingPageService,
    private messageService: MessageService
  ) {}

  onVideoUpload(event: any, index: number) {
    const file = event.files[0];
    if (file) {
      this.landingPageService.uploadMedia(file, 'video').subscribe({
        next: (response) => {
          this.videos[index].url = response.url;
          this.update.emit(this.videos);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Video uploaded successfully'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload video'
          });
        }
      });
    }
  }

  onVideoChange() {
    this.update.emit(this.videos);
  }
} 