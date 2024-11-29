import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { BlogPostDetails } from '../../interfaces/blog-post-details';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Comments } from '../../interfaces/comments';
import { FormsModule } from '@angular/forms';
import { PostCommentRequest } from '../../interfaces/post-comment-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDetail } from '../../interfaces/user-detail';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  authService = inject(AuthService);
  blogService = inject(BlogService);
  matSnackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  userDetail!: UserDetail;
  newComment: PostCommentRequest = {
    content: '',
    blogPostId: 0,
  };
  postId!: number;
  blogPostDetails: BlogPostDetails = {
    id: 0,
    title: '',
    shortDescription: '',
    authorFullName: '',
    authorId: '',
    content: '',
    futuredImageUrl: '',
    categories: [],
    comments: [],
  };

  onSubmitComment() {
    if (this.newComment.content?.trim()) {
      this.newComment.blogPostId = this.blogPostDetails.id;
      this.blogService.createPostComment(this.newComment).subscribe({
        next: (response) => {
          this.newComment.content = '';
          this.matSnackBar.open(response.message, 'Close', {
            duration: 3000,
          });
          this.blogService.getBlogPostById(this.postId).subscribe({
            next: (response) => {
              this.blogPostDetails = response;
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        error: (err) => {
          this.matSnackBar.open(err.response, 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      this.matSnackBar.open('Please write your toughts first', 'Close', {
        duration: 3000,
      });
    }
  }

  deleteComment(commentId: number) {
    this.blogService.deleteComment(commentId).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 3000,
        });
        this.blogService.getBlogPostById(this.postId).subscribe({
          next: (response) => {
            this.blogPostDetails = response;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
        this.matSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  ngOnInit(): void {
    this.postId = +this.route.snapshot.paramMap.get('id')!;
    this.blogService.getBlogPostById(this.postId).subscribe({
      next: (response) => {
        this.blogPostDetails = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.userDetail = this.authService.getUserDetail() as UserDetail;
  }
}
