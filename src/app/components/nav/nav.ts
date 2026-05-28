import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnInit {
  protected authService = inject(AuthService);
  private keycloak = inject(Keycloak);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  readonly isLoggedIn = signal(this.keycloak.authenticated ?? false);

  categories = signal<Category[]>([]);
  activeCategory = signal<string | null>(null);
  openMenuId = signal<number | null>(null);
  mobileMenuOpen = signal(false);
  openMobileCatId = signal<number | null>(null);

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.categoryService.getCategories().subscribe({ next: (c) => this.categories.set(c) });

    const syncFromUrl = () => {
      const tree = this.router.parseUrl(this.router.url);
      this.activeCategory.set(tree.queryParams['category'] ?? null);
    };
    syncFromUrl();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      syncFromUrl();
      this.closeMenu();
      this.mobileMenuOpen.set(false);
      this.openMobileCatId.set(null);
    });
  }

  menuEnter(id: number) {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.openMenuId.set(id);
  }

  menuLeave() {
    this.closeTimer = setTimeout(() => this.openMenuId.set(null), 120);
  }

  closeMenu() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.openMenuId.set(null);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    if (!this.mobileMenuOpen()) this.openMobileCatId.set(null);
  }

  toggleMobileCat(id: number) {
    this.openMobileCatId.update(current => current === id ? null : id);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
    this.mobileMenuOpen.set(false);
    this.openMobileCatId.set(null);
  }

  isCatActive(cat: Category): boolean {
    const active = this.activeCategory();
    if (!active) return false;
    return cat.slug === active || (cat.children ?? []).some(c => c.slug === active);
  }

  categoryParams(slug: string) { return { category: slug }; }
}
