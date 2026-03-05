import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Post } from '../models';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPosts() {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  getPost(slug: string) {
    return this.http.get<Post>(`${this.apiUrl}/posts/${slug}`);
  }

  getPostById(id: number) {
    return this.http.get<Post>(`${this.apiUrl}/posts/id/${id}`);
  }

  createPost(post: Post) {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: Post) {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
