import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCategories() {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(cat: Partial<Category>) {
    return this.http.post<Category>(`${this.apiUrl}/categories`, cat);
  }

  updateCategory(id: number, cat: Partial<Category>) {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, cat);
  }

  deleteCategory(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }
}
