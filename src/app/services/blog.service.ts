import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreatePostObject } from '../interfaces/create-post-object';
import { BlogResponse } from '../interfaces/blog-response';
import { Categories } from '../interfaces/categories';
import { BlogPost } from '../interfaces/blog-post';
import { BlogPostDetails } from '../interfaces/blog-post-details';
import { PostCommentRequest } from '../interfaces/post-comment-request';
import { BlogPostDisplay } from '../interfaces/blog-post-display';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createPost(data: CreatePostObject): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(`${this.apiUrl}blog`, data);
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}blog`);
  }

  getBlogPostById = (id: number): Observable<BlogPostDetails> =>
    this.http.get<BlogPostDetails>(`${this.apiUrl}blog/${id}`);

  getBlogPostsByAuthorId = (authorId: string): Observable<BlogPost[]> =>
    this.http.get<BlogPost[]>(`${this.apiUrl}blog/get-posts/${authorId}`);

  getBlogPostsByCategory = (categoryId: number): Observable<BlogPost[]> =>
    this.http.get<BlogPost[]>(`${this.apiUrl}blog/categories/${categoryId}`);

  deleteBlog = (id: number): Observable<BlogResponse> =>
    this.http.delete<BlogResponse>(`${this.apiUrl}blog/${id}`);

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(
      `${this.apiUrl}blog/upload-picture`,
      formData
    );
  }

  createPostComment(data: PostCommentRequest): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(
      `${this.apiUrl}blog/post-comment`,
      data
    );
  }

  deleteComment = (id: number): Observable<BlogResponse> =>
    this.http.delete<BlogResponse>(`${this.apiUrl}blog/comment/${id}`);

  getCategories = (): Observable<Categories[]> =>
    this.http.get<Categories[]>(`${this.apiUrl}blog/get-categories`);
}
