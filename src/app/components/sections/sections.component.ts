import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/landing-page.service';
import { LandingPageSection, LandingPageContent } from '../../interfaces/landing-page.interface';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { HeroEditorComponent } from './hero-editor/hero-editor.component';
import { VideosEditorComponent } from './videos-editor/videos-editor.component';
import { ServicesEditorComponent } from './services-editor/services-editor.component';
import { CompareEditorComponent } from './compare-editor/compare-editor.component';
import { BrandsEditorComponent } from './brands-editor/brands-editor.component';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    TabViewModule,
    ProgressSpinnerModule,
    HeroEditorComponent,
    VideosEditorComponent,
    ServicesEditorComponent,
    CompareEditorComponent,
    BrandsEditorComponent,
  ],
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SectionsComponent implements OnInit {
  landingPageContent: LandingPageSection | null = null;
  loading = true;
  activeTab = 0;

  constructor(
    private landingPageService: LandingPageService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    this.loading = true;
    this.landingPageService.getLandingPageContent().subscribe({
      next: (content) => {
        this.landingPageContent = content;
        this.loading = false;
      },
      error: (error) => {
        // Initialize with default content if there's an error
        this.landingPageContent = {
          id: '',
          content: {
            hero: {
              logo: '',
              backgroundImage: '',
              mainTitle: ''
            },
            servicesCarousel: [],
            videos: [],
            compareSection: {
              beforeImage: '',
              afterImage: '',
              title: ''
            },
            brandsCarousel: []
          },
          lastUpdated: new Date()
        };
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load landing page content'
        });
      }
    });
  }

  onHeroUpdate(heroContent: LandingPageContent['hero']) {
    this.landingPageService.updateHeroSection(heroContent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sección principal actualizada correctamente'
        });
        this.loadContent();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la sección hero'
        });
      }
    });
  }

  onServicesUpdate(services: LandingPageContent['servicesCarousel']) {
    this.landingPageService.updateServicesCarousel(services).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Carrusel de servicios actualizado correctamente'
        });
        this.loadContent();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el carrusel de servicios'
        });
      }
    });
  }

  onVideosUpdate(videos: LandingPageContent['videos']) {
    this.landingPageService.updateVideos(videos).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Videos actualizados correctamente'
        });
        this.loadContent();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar los videos'
        });
      }
    });
  }

  onCompareUpdate(compareSection: LandingPageContent['compareSection']) {
    this.landingPageService.updateCompareSection(compareSection).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sección de comparación actualizada correctamente'
        });
        this.loadContent();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la sección de comparación'
        });
      }
    });
  }

  onBrandsUpdate(brands: LandingPageContent['brandsCarousel']) {
    this.landingPageService.updateBrandsCarousel(brands).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Carrusel de marcas actualizado correctamente'
        });
        this.loadContent();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el carrusel de marcas'
        });
      }
    });
  }
} 