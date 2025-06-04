import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ImageItem {
  url: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(this.apiUrl, formData);
  }

  listImages(): Observable<{ images: ImageItem[] }> {
    return this.http.get<{ images: ImageItem[] }>(`${this.apiUrl}/images`);
  }
} 