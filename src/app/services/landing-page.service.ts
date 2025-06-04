import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LandingPageSection, LandingPageContent } from '../interfaces/landing-page.interface';
import { environment } from '../../environments/environment';
import { UploadService } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  private apiUrl = `${environment.apiUrl}/landing-page`;

  constructor(
    private http: HttpClient,
    private uploadService: UploadService
  ) {}

  getLandingPageContent(): Observable<LandingPageSection> {
    return this.http.get<LandingPageSection>(`${this.apiUrl}/content`);
  }

  updateHeroSection(heroContent: LandingPageContent['hero']): Observable<LandingPageSection> {
    return this.http.patch<LandingPageSection>(`${this.apiUrl}/hero`, heroContent);
  }

  updateServicesCarousel(services: LandingPageContent['servicesCarousel']): Observable<LandingPageSection> {
    return this.http.patch<LandingPageSection>(`${this.apiUrl}/services`, services);
  }

  updateVideos(videos: LandingPageContent['videos']): Observable<LandingPageSection> {
    return this.http.patch<LandingPageSection>(`${this.apiUrl}/videos`, videos);
  }

  updateCompareSection(compareSection: LandingPageContent['compareSection']): Observable<LandingPageSection> {
    return this.http.patch<LandingPageSection>(`${this.apiUrl}/compare`, compareSection);
  }

  updateBrandsCarousel(brands: LandingPageContent['brandsCarousel']): Observable<LandingPageSection> {
    return this.http.patch<LandingPageSection>(`${this.apiUrl}/brands`, brands);
  }

  // File upload methods
  uploadMedia(file: File, type: 'image' | 'video'): Observable<{ url: string }> {
    return this.uploadService.uploadFile(file);
  }
} 