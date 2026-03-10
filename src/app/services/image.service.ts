import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<{ url: string }>(`${this.apiUrl}/images`, formData)
      .pipe(map((res) => res.url));
  }

  delete(filename: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/images/${filename}`);
  }
}
