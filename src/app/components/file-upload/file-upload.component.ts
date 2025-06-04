import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-container">
      <input
        type="file"
        (change)="onFileSelected($event)"
        accept="image/*"
        #fileInput
        style="display: none"
      />
      <button (click)="fileInput.click()">Select Image</button>
      <div *ngIf="selectedFile">
        <p>Selected file: {{ selectedFile.name }}</p>
        <button (click)="uploadFile()" [disabled]="uploading">
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
      <div *ngIf="uploadedUrl">
        <p>Upload successful!</p>
        <img [src]="uploadedUrl" alt="Uploaded image" style="max-width: 200px" />
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      text-align: center;
    }
    button {
      margin: 10px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadedUrl: string | null = null;
  uploading = false;

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadedUrl = null;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedUrl = response.url;
        this.uploading = false;
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.uploading = false;
      }
    });
  }
} 