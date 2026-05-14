import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnInit {
  protected authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  activeCategory = signal<string | null>(null);
  openMenuId = signal<number | null>(null);

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
    });
  }

  // Open immediately on enter, cancel any pending close
  menuEnter(id: number) {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.openMenuId.set(id);
  }

  // Delay close so the mouse has time to travel from trigger into the dropdown
  menuLeave() {
    this.closeTimer = setTimeout(() => this.openMenuId.set(null), 120);
  }

  closeMenu() {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.openMenuId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeMenu(); }

  isCatActive(cat: Category): boolean {
    const active = this.activeCategory();
    if (!active) return false;
    return cat.slug === active || (cat.children ?? []).some(c => c.slug === active);
  }

  categoryParams(slug: string) { return { category: slug }; }
}
