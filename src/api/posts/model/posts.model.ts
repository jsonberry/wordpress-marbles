import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

export interface PostsDao {
  allPosts$: Observable<AxiosResponse<any>>;
  posts$(params?: any): Observable<AxiosResponse<any>>;
  post$(id: string): Observable<AxiosResponse<any>>;
}
