export interface BlogPost {
  id: number;
  title: string;
  shortDescription: string;
  createdAt: Date;
  futuredImageUrl: string;
  authorId: string;
  authorFullName: string;
  categories: string[];
}
