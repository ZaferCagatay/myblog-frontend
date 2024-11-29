import { Comments } from './comments';

export interface BlogPostDetails {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt?: Date;
  futuredImageUrl: string;
  authorId: string;
  authorFullName: string;
  categories: string[];
  comments: Comments[];
}
