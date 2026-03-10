import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ContactSubmission } from '../models';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  submit(request: ContactRequest) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/contact`, request);
  }

  getSubmissions() {
    return this.http.get<ContactSubmission[]>(`${this.apiUrl}/contact`);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.apiUrl}/contact/${id}/read`, {});
  }
}
