import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ImageItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  upload(file: File): Observable<ImageItem> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImageItem>(`${this.apiUrl}/images`, formData);
  }

  getImages(): Observable<ImageItem[]> {
    return this.http.get<ImageItem[]>(`${this.apiUrl}/images/admin/all`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/images/${id}`);
  }
}
