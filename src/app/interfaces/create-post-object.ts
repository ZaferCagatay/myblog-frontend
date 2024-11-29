export interface CreatePostObject {
  title: string;
  description: string;
  content: string;
  pictureUrl?: string;
  categoryIds: number[];
}
