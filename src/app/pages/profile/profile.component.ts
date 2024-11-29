import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPostCardComponent } from '../../components/blog-post-card/blog-post-card.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogPost } from '../../interfaces/blog-post';
import { UserDetail } from '../../interfaces/user-detail';
import { Categories } from '../../interfaces/categories';
import { UserDetailShort } from '../../interfaces/user-detail-short';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    BlogPostCardComponent,
    CommonModule,
    SidebarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  authService = inject(AuthService);
  blogService = inject(BlogService);
  route = inject(ActivatedRoute);
  selectedCategoryName!: string | null;
  isSelectedCategoryEmpty!: boolean;
  private allBlogPosts: BlogPost[] = [];
  private blogPostsSubject = new BehaviorSubject<BlogPost[]>([]);
  blogPosts$: Observable<BlogPost[]> = this.blogPostsSubject.asObservable();
  userDetail!: UserDetail;
  authorDetail: UserDetail = {
    id: '',
    fullName: '------',
    email: '------@-----.---',
    roles: [],
    phoneNumber: '',
    twoFactorEnabled: true,
    phoneNumberConfirmed: true,
    accessFailedCount: 0,
  };
  authorId!: string;

  onPostDeleted(postId: number) {
    const updatedPosts = this.blogPostsSubject.value.filter(
      (post) => post.id !== postId
    );
    this.blogPostsSubject.next(updatedPosts);
    console.log(`Post with ID ${postId} deleted.`);
  }

  onCategoryChange(category: Categories) {
    const filteredPosts = this.allBlogPosts.filter((post) =>
      post.categories.some((cat) => cat === category.name)
    );
    this.selectedCategoryName = category.name;
    if (filteredPosts.length > 0) {
      this.blogPostsSubject.next(filteredPosts);
      this.isSelectedCategoryEmpty = false;
    } else {
      this.isSelectedCategoryEmpty = true;
    }
  }

  categoryRemoved(category: Categories) {
    this.blogPostsSubject.next(this.allBlogPosts);
    this.selectedCategoryName = null;
    this.isSelectedCategoryEmpty = false;
  }

  ngOnInit(): void {
    this.authorId = this.route.snapshot.paramMap.get('userId')!;
    this.blogService
      .getBlogPostsByAuthorId(this.authorId)
      .subscribe((posts) => {
        this.blogPostsSubject.next(posts);
        this.allBlogPosts = posts;
      });
    this.userDetail = this.authService.getUserDetail() as UserDetail;
    this.authService.getUserDetailById(this.authorId).subscribe({
      next: (response) => {
        this.authorDetail = {
          id: response.id,
          fullName: response.fullName,
          email: response.email,
          roles: response.roles,
          phoneNumber: '',
          twoFactorEnabled: true,
          phoneNumberConfirmed: true,
          accessFailedCount: 0,
        };
      },
    });
  }
}
