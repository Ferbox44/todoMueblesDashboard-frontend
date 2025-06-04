import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BrandItem } from '../../../interfaces/landing-page.interface';
import { LandingPageService } from '../../../services/landing-page.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brands-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadModule, ToastModule],
  templateUrl: './brands-editor.component.html',
  styleUrls: ['./brands-editor.component.scss'],
  providers: [MessageService]
})
export class BrandsEditorComponent {
  @Input() brands!: BrandItem[];
  @Output() update = new EventEmitter<BrandItem[]>();

  constructor(
    private landingPageService: LandingPageService,
    private messageService: MessageService
  ) {}

  onImageUpload(event: any, index: number) {
    const file = event.files[0];
    if (file) {
      this.landingPageService.uploadMedia(file, 'image').subscribe({
        next: (response) => {
          this.brands[index].image = response.url;
          this.update.emit(this.brands);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Brand image uploaded successfully'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload brand image'
          });
        }
      });
    }
  }

  onNameChange(index: number) {
    this.update.emit(this.brands);
  }
} 