import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models';

@Component({
  selector: 'app-categories-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './categories-admin.html',
  styleUrl: './categories-admin.scss',
})
export class CategoriesAdmin {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // New top-level form
  newTopName = '';
  newTopSlug = '';
  addingTop = signal(false);

  // New sub-category form (keyed by parent id)
  addingChildOf = signal<number | null>(null);
  newChildName = '';
  newChildSlug = '';

  // Rename state
  editingId = signal<number | null>(null);
  editName = '';
  editSlug = '';

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (cats) => { this.categories.set(cats); this.loading.set(false); },
      error: () => { this.error.set('Failed to load categories.'); this.loading.set(false); },
    });
  }

  slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  onNewTopNameInput() { this.newTopSlug = this.slugify(this.newTopName); }
  onNewChildNameInput() { this.newChildSlug = this.slugify(this.newChildName); }
  onEditNameInput() { this.editSlug = this.slugify(this.editName); }

  saveTop() {
    if (!this.newTopName.trim()) return;
    this.categoryService.createCategory({ name: this.newTopName.trim(), slug: this.newTopSlug.trim(), parentId: null }).subscribe({
      next: () => { this.newTopName = ''; this.newTopSlug = ''; this.addingTop.set(false); this.load(); },
      error: (e) => this.error.set(e.error ?? 'Failed to create category.'),
    });
  }

  saveChild(parentId: number) {
    if (!this.newChildName.trim()) return;
    this.categoryService.createCategory({ name: this.newChildName.trim(), slug: this.newChildSlug.trim(), parentId }).subscribe({
      next: () => { this.newChildName = ''; this.newChildSlug = ''; this.addingChildOf.set(null); this.load(); },
      error: (e) => this.error.set(e.error ?? 'Failed to create category.'),
    });
  }

  startEdit(cat: Category) {
    this.editingId.set(cat.id);
    this.editName = cat.name;
    this.editSlug = cat.slug;
  }

  saveEdit(cat: Category) {
    this.categoryService.updateCategory(cat.id, { name: this.editName.trim(), slug: this.editSlug.trim(), parentId: cat.parentId }).subscribe({
      next: () => { this.editingId.set(null); this.load(); },
      error: (e) => this.error.set(e.error ?? 'Failed to update category.'),
    });
  }

  cancelEdit() { this.editingId.set(null); }

  delete(id: number) {
    if (!confirm('Delete this category? Posts in it will become uncategorised.')) return;
    this.categoryService.deleteCategory(id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Failed to delete category.'),
    });
  }

  moveTop(index: number, direction: -1 | 1) {
    const list = [...this.categories()];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= list.length) return;
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
    const items = list.map((cat, i) => ({ id: cat.id, sortOrder: i }));
    this.categoryService.reorderCategories(items).subscribe({
      next: () => this.categories.set(list),
      error: () => this.error.set('Failed to reorder categories.'),
    });
  }

  moveChild(parent: Category, index: number, direction: -1 | 1) {
    const children = [...(parent.children ?? [])];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= children.length) return;
    [children[index], children[swapIndex]] = [children[swapIndex], children[index]];
    const items = children.map((cat, i) => ({ id: cat.id, sortOrder: i }));
    this.categoryService.reorderCategories(items).subscribe({
      next: () => {
        const roots = this.categories().map(cat =>
          cat.id === parent.id ? { ...cat, children } : cat
        );
        this.categories.set(roots);
      },
      error: () => this.error.set('Failed to reorder categories.'),
    });
  }
}
