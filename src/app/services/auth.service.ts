import { inject, Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak = inject(Keycloak);

  readonly isLoggedIn = signal(this.keycloak.authenticated ?? false);

  async login(redirectUri?: string) {
    await this.keycloak.login({ redirectUri: redirectUri ?? window.location.origin + '/admin' });
  }

  async logout() {
    await this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
