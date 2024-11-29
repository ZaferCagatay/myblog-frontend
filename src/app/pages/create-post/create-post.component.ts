import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreatePostObject } from '../../interfaces/create-post-object';
import { UploadService } from '../../services/upload.service';
import { BlogService } from '../../services/blog.service';
import { CommonModule } from '@angular/common';
import { Categories } from '../../interfaces/categories';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  uploadService = inject(UploadService);
  blogService = inject(BlogService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  categories$!: Observable<Categories[]>;
  post: CreatePostObject = {
    title: '',
    description: '',
    content: '',
    categoryIds: [], // Initialize categoryIds as an empty array
  };
  pictureUrl!: string;
  loading = true;

  onSubmit() {
    console.log(this.post);
    this.blogService.createPost(this.post).subscribe({
      next: (response) => {
        console.log(response);
        this.matSnackBar.open(response.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        if (err!.status === 400) {
          this.matSnackBar.open('Validations error', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
          });
        }
      },
      complete: () => console.log('Post published successfully!'),
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (response) => {
          // Get the uploaded photo URL and set it to the form model
          this.post.pictureUrl = response.url;
        },
        error: (err) => console.error('File upload failed', err),
      });
    }
  }

  // Handle category checkbox change
  onCategoryChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.post.categoryIds.push(categoryId);
    } else {
      this.post.categoryIds = this.post.categoryIds.filter(
        (id) => id !== categoryId
      );
    }
  }

  ngOnInit(): void {
    this.categories$ = this.blogService.getCategories();
    this.categories$.subscribe({
      next: (categories) => {
        this.loading = false; // Categories are loaded, turn off loading
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading categories', err);
      },
    });
  }
}
