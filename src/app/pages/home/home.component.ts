import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogPost } from '../../interfaces/blog-post';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BlogPostCardComponent } from '../../components/blog-post-card/blog-post-card.component';
import { UserDetail } from '../../interfaces/user-detail';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Categories } from '../../interfaces/categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    BlogPostCardComponent,
    CommonModule,
    SidebarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  blogService = inject(BlogService);
  selectedCategoryName!: string | null;
  isSelectedCategoryEmpty!: boolean;
  private blogPostsSubject = new BehaviorSubject<BlogPost[]>([]);
  blogPosts$: Observable<BlogPost[]> = this.blogPostsSubject.asObservable();
  userDetail!: UserDetail;

  onCategoryChange(category: Categories) {
    this.blogService.getBlogPostsByCategory(category.id).subscribe((posts) => {
      this.selectedCategoryName = category.name;
      if (posts.length > 0) {
        this.blogPostsSubject.next(posts);
        this.isSelectedCategoryEmpty = false;
      } else {
        this.isSelectedCategoryEmpty = true;
      }
    });
  }

  categoryRemoved(category: Categories) {
    this.blogService.getBlogPosts().subscribe((posts) => {
      this.blogPostsSubject.next(posts);
      this.selectedCategoryName = null;
      this.isSelectedCategoryEmpty = false;
    });
  }

  onPostDeleted(postId: number) {
    const updatedPosts = this.blogPostsSubject.value.filter(
      (post) => post.id !== postId
    );
    this.blogPostsSubject.next(updatedPosts);
    console.log(`Post with ID ${postId} deleted.`);
  }

  ngOnInit(): void {
    this.blogService.getBlogPosts().subscribe((posts) => {
      this.blogPostsSubject.next(posts);
    });
    this.userDetail = this.authService.getUserDetail() as UserDetail;
  }
}
