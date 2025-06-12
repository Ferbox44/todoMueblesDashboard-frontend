import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ServiceDetailsService, ServiceDetail, Project } from '../../../services/service-details.service';
import { ImageItem, UploadService } from '../../../services/upload.service';
import { ProjectEditorComponent } from './project-editor/project-editor.component';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-service-detail-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule,
    ProjectEditorComponent,
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './service-detail-editor.component.html',
  styleUrls: ['./service-detail-editor.component.scss']
})
export class ServiceDetailEditorComponent implements OnInit {
  serviceDetail: ServiceDetail | null = null;
  loading = true;
  error: string | null = null;
  saving = false;
  serviceId!: string;
  uploadedImages: ImageItem[] = [];
  showImageSelector = false;
  showProjectEditor = false;
  selectedProject: Project | null = null;
  currentImageType: 'material' | 'accessory' | null = null;
  selectedFile: File | null = null;
  isUploading = false;


  constructor(
    private route: ActivatedRoute,
    private serviceDetailsService: ServiceDetailsService,
    private uploadService: UploadService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const serviceId = params['id'];
      this.serviceId = serviceId;
      this.loadServiceDetail(serviceId);
      this.loadImages();
    });
  }

  private loadServiceDetail(serviceId: string) {
    this.loading = true;
    this.error = null;

    this.serviceDetailsService.getServiceDetail(serviceId).subscribe({
      next: (detail) => {
        this.serviceDetail = detail;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading service detail';
        this.loading = false;
        console.error('Error loading service detail:', error);
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
          detail: 'Failed to load images'
        });
      }
    });
  }

  selectImage(image: { url: string }) {
    this.serviceDetail!.backgroundImage = image.url;
    this.showImageSelector = false;
  }

  saveChanges() {
    if (!this.serviceDetail) return;

    this.saving = true;
    this.serviceDetailsService.updateServiceDetail(this.serviceId, this.serviceDetail).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Service detail updated successfully'
        });
        this.saving = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update service detail'
        });
        console.error('Error updating service detail:', error);
        this.saving = false;
      }
    });
  }

  addProject() {
    this.selectedProject = {
      title: '',
      description: '',
      image: '',
      images: []
    };
    this.showProjectEditor = true;
  }

  editProject(project: Project) {
    this.selectedProject = { ...project };
    this.showProjectEditor = true;
  }

  onProjectUpdate(project: Project) {
    if (!this.serviceDetail) return;

    const index = this.serviceDetail.projects.findIndex(p => p.id === project.id);
    if (index === -1) {
      // New project
      this.serviceDetailsService.addProject(this.serviceId, project).subscribe({
        next: (newProject) => {
          this.serviceDetail?.projects.push(newProject);
          this.showProjectEditor = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project added successfully'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add project'
          });
          console.error('Error adding project:', error);
        }
      });
    } else {
      // Update existing project
      if (!project.id) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot update project without an ID'
        });
        return;
      }
      this.serviceDetailsService.updateProject(project.id, project).subscribe({
        next: (updatedProject) => {
          if (this.serviceDetail) {
            this.serviceDetail.projects[index] = updatedProject;
          }
          this.showProjectEditor = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project updated successfully'
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update project'
          });
          console.error('Error updating project:', error);
        }
      });
    }
  }

  onProjectDelete(projectId: string) {
    if (!this.serviceDetail) return;

    this.serviceDetailsService.deleteProject(projectId).subscribe({
      next: () => {
        if (this.serviceDetail) {
          this.serviceDetail.projects = this.serviceDetail.projects.filter(p => p.id !== projectId);
        }
        this.showProjectEditor = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project deleted successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete project'
        });
        console.error('Error deleting project:', error);
      }
    });
  }

  getMaterialCount(project: Project): number {
    return project.images?.filter(img => img.type === 'material').length || 0;
  }

  getAccessoryCount(project: Project): number {
    return project.images?.filter(img => img.type === 'accessory').length || 0;
  }

  openImageSelector(type: 'material' | 'accessory') {
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
        if (this.currentImageType === 'material') {
          this.serviceDetail!.backgroundImage = response.url;
        } else if (this.currentImageType === 'accessory') {
          this.serviceDetail!.backgroundImage = response.url;
        }
        
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
          detail: 'Image uploaded successfully'
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
          detail: 'Failed to upload image'
          });
        this.isUploading = false;
        }
      });
    }

  cancelUpload() {
    this.selectedFile = null;
  }
} 