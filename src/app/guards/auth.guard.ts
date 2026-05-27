import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

async function isAccessAllowed(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  { authenticated }: AuthGuardData,
): Promise<boolean | UrlTree> {
  if (authenticated) return true;

  const router = inject(Router);
  return router.parseUrl('/admin/login');
}

export const authGuard = createAuthGuard(isAccessAllowed);
