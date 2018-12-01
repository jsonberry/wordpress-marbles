import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import * as https from 'https';
import { from, range } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { mergeMap, pluck, reduce, switchMap, tap } from 'rxjs/operators';
import { postTransducer } from './helpers';
import { postsCache$ } from './posts.cache';
import { PostsDao, Post } from './posts.model';
dotenv.config();

const http = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // this helps get around self signed cert validation errors in Node
  })
});

export const endpoint = `${process.env.API_BASE}/wp/v2/posts`;

export const postsDao: PostsDao = {
  allPosts$: from(http.head(endpoint)).pipe(
    switchMap(({ headers }) => range(1, Number(headers['x-wp-totalpages']))),
    mergeMap(page =>
      http.get(endpoint, {
        params: {
          page
        }
      })
    )
  ),
  posts$: params => from(axios.get(endpoint, { params })),
  post$: id => from(axios.get(`${endpoint}/${id}`))
};

export const newPostsRequest$ = postsDao.allPosts$.pipe(
  hasProps('data'),
  pluck<AxiosResponse, any[]>('data'),
  mergeMap(data => data),
  postTransducer,
  reduce((acc, val: Post) => ({ ...acc, [val.id]: val }), {} as Post),
  tap(posts => postsCache$.next(posts))
);
