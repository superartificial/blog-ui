import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'posts/:slug',
    loadComponent: () => import('./pages/post/post').then((m) => m.PostPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'admin/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/editor/editor').then((m) => m.Editor),
  },
  {
    path: 'admin/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/editor/editor').then((m) => m.Editor),
  },
  {
    path: 'admin/contacts',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/contacts/contacts').then((m) => m.Contacts),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
