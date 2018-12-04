import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Entity } from '../../common';

export interface PostsDao {
  allPosts$: Observable<AxiosResponse<any>>;
  posts$(params?: any): Observable<AxiosResponse<any>>;
  post$(id: string): Observable<AxiosResponse<any>>;
}

export interface Post extends Entity {
  acf?: Record<string, any>;
  author_id: number;
  categories: number[];
  excerpt: string;
  tags: number[];
}
