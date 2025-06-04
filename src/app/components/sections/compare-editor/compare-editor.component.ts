import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CompareSection } from '../../../interfaces/landing-page.interface';
import { LandingPageService } from '../../../services/landing-page.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compare-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadModule, ToastModule],
  templateUrl: './compare-editor.component.html',
  styleUrls: ['./compare-editor.component.scss'],
  providers: [MessageService]
})
export class CompareEditorComponent {
  @Input() compareSection!: CompareSection;
  @Output() update = new EventEmitter<CompareSection>();

  constructor(
    private landingPageService: LandingPageService,
    private messageService: MessageService
  ) {}

  onBeforeImageUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.landingPageService.uploadMedia(file, 'image').subscribe({
        next: (response) => {
          this.compareSection.beforeImage = response.url;
          this.update.emit(this.compareSection);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Before image uploaded successfully'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload before image'
          });
        }
      });
    }
  }

  onAfterImageUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.landingPageService.uploadMedia(file, 'image').subscribe({
        next: (response) => {
          this.compareSection.afterImage = response.url;
          this.update.emit(this.compareSection);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'After image uploaded successfully'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload after image'
          });
        }
      });
    }
  }

  onTitleChange() {
    this.update.emit(this.compareSection);
  }
} 