import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BlogPost } from '../../interfaces/blog-post';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { UserDetail } from '../../interfaces/user-detail';

@Component({
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './blog-post-card.component.html',
  styleUrl: './blog-post-card.component.css',
})
export class BlogPostCardComponent {
  @Input() post!: BlogPost;
  @Input() userDetail!: UserDetail;
  @Output() postDeleted: EventEmitter<number> = new EventEmitter<number>();
  blogService = inject(BlogService);
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);

  deletePost() {
    this.blogService.deleteBlog(this.post.id).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 3000,
        });
        this.postDeleted.emit(this.post.id);
      },
      error: (err) => {
        console.log(err);
        this.matSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
