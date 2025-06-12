import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ImageItem {
  url: string;
  key: string;
}

export interface VideoItem {
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
    console.log('Starting file upload:', file.name, 'Size:', file.size, 'Type:', file.type);
    const formData = new FormData();
    formData.append('file', file);
    //formData.append('type', 'image');

    console.log('Sending request to:', this.apiUrl);
    return this.http.post<{ url: string }>(this.apiUrl, formData).pipe(
      tap({
        next: (response) => console.log('Upload successful:', response),
        error: (error) => console.error('Upload failed:', error)
      })
    );
  }

  listImages(): Observable<{ images: ImageItem[] }> {
    console.log('Fetching images from:', `${this.apiUrl}/images`);
    return this.http.get<{ images: ImageItem[] }>(`${this.apiUrl}/images`).pipe(
      tap({
        next: (response) => console.log('Images fetched successfully:', response),
        error: (error) => console.error('Failed to fetch images:', error)
      })
    );
  }

  listVideos(): Observable<{ videos: VideoItem[] }> {
    console.log('Fetching videos from:', `${this.apiUrl}/videos`);
    return this.http.get<{ videos: VideoItem[] }>(`${this.apiUrl}/videos`).pipe(
      tap({
        next: (response) => console.log('Videos fetched successfully:', response),
        error: (error) => console.error('Failed to fetch videos:', error)
      })
    );
  }
} 