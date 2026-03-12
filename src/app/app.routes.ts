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
    path: 'admin/pages',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/pages-admin/pages-admin').then((m) => m.PagesAdmin),
  },
  {
    path: 'admin/pages/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/page-editor/page-editor').then((m) => m.PageEditor),
  },
  {
    path: 'admin/pages/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/page-editor/page-editor').then((m) => m.PageEditor),
  },
  {
    path: 'admin/images',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/images-admin/images-admin').then((m) => m.ImagesAdmin),
  },
  {
    path: 'pages/:slug',
    loadComponent: () => import('./pages/page/page').then((m) => m.PagePage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
