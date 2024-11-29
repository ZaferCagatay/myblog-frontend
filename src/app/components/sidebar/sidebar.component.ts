import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Categories } from '../../interfaces/categories';
import { Observable } from 'rxjs';
import { BlogPost } from '../../interfaces/blog-post';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Output() categoryChoiced: EventEmitter<Categories> =
    new EventEmitter<Categories>();
  @Output() categoryNotChoiced: EventEmitter<Categories> =
    new EventEmitter<Categories>();
  blogService = inject(BlogService);
  categories$!: Observable<Categories[]>;
  randomPosts!: BlogPost[];
  choiced!: Categories;
  isChoiced!: boolean;

  choicedCategory(category: Categories) {
    if (category.id == this.choiced?.id) {
      this.isChoiced = false;
      this.choiced = { id: 0, name: '' };
      this.categoryNotChoiced.emit(category);
    } else {
      this.choiced = category;
      this.isChoiced = true;
      this.categoryChoiced.emit(category);
    }
  }

  getRandomPosts(posts: any[], count: number): any[] {
    const shuffled = posts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  ngOnInit(): void {
    this.categories$ = this.blogService.getCategories();
    this.blogService.getBlogPosts().subscribe({
      next: (response) => {
        this.randomPosts = this.getRandomPosts(response, 3);
        console.log(this.randomPosts);
      },
    });
    this.isChoiced = false;
  }
}
