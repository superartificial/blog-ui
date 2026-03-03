import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models';

const TOKEN_KEY = 'blog_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly isLoggedIn = signal(!!localStorage.getItem(TOKEN_KEY));

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem(TOKEN_KEY, res.token);
          this.isLoggedIn.set(true);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
