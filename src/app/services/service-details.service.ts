import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProjectImage {
  id?: string;
  url: string;
  type: 'material' | 'accessory' | 'main';
  title: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  images: ProjectImage[];
}

export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  projects: Project[];
}

@Injectable({
  providedIn: 'root'
})
export class ServiceDetailsService {
  private apiUrl = `${environment.apiUrl}/service-details`;

  constructor(private http: HttpClient) {}

  getServiceDetail(serviceId: string): Observable<ServiceDetail> {
    return this.http.get<ServiceDetail>(`${this.apiUrl}/${serviceId}`);
  }

  createServiceDetail(serviceId: string, detail: Partial<ServiceDetail>): Observable<ServiceDetail> {
    return this.http.post<ServiceDetail>(`${this.apiUrl}/${serviceId}`, detail);
  }

  updateServiceDetail(serviceId: string, detail: Partial<ServiceDetail>): Observable<ServiceDetail> {
    return this.http.put<ServiceDetail>(`${this.apiUrl}/${serviceId}`, detail);
  }

  deleteServiceDetail(serviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${serviceId}`);
  }

  addProject(serviceId: string, project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/${serviceId}/projects`, project).pipe(
      catchError(error => {
        console.error('Error adding project:', error);
        return throwError(() => new Error('Failed to add project'));
      })
    );
  }

  updateProject(projectId: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${projectId}`, project);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/projects`);
  }

  addProjectImage(projectId: string, image: Partial<ProjectImage>): Observable<ProjectImage> {
    return this.http.post<ProjectImage>(`${this.apiUrl}/${projectId}/projects/images`, image);
  }

  deleteProjectImage(imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/images/${imageId}`);
  }

  update(serviceId: string, serviceDetail: ServiceDetail): Observable<ServiceDetail> {
    return this.http.put<ServiceDetail>(`${this.apiUrl}/${serviceId}`, serviceDetail).pipe(
      catchError(error => {
        console.error('Error updating service detail:', error);
        return throwError(() => new Error('Failed to update service detail'));
      })
    );
  }
} 