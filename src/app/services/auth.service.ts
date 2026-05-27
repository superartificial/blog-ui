import { inject, Injectable, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak = inject(KeycloakService);

  readonly isLoggedIn = signal(this.keycloak.isLoggedIn());

  async login(redirectUri?: string) {
    await this.keycloak.login({ redirectUri: redirectUri ?? window.location.origin + '/admin' });
  }

  async logout() {
    await this.keycloak.logout(window.location.origin);
  }
}
