import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Entity } from '../common';

export interface PagesDao {
  allPages$: Observable<AxiosResponse<any>>;
  pages$(params?: any): Observable<AxiosResponse<any>>;
  page$(id: string): Observable<AxiosResponse<any>>;
}

export type Page = Entity;
