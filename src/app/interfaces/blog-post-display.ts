export interface BlogPostDisplay {
  id: number;
  title: string;
  shortDescription: string;
  futuredImageUrl: string;
  createdAt: Date;
  authorId: string;
  authorFullName: string;
  categories: string[];
}
