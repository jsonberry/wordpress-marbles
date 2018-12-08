import { Entity } from '../../common';

export interface PostImage {
  thumbnail: string;
  medium: string;
  medium_large: string;
  full: string;
}

export interface Post extends Entity {
  acf?: Record<string, any>;
  author_id: number;
  categories: number[];
  excerpt: string;
  tags: number[];
  image: PostImage;
}
