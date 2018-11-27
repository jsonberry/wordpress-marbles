import axios from 'axios';
import * as dotenv from 'dotenv';
import { from, range } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { PostsDao } from './posts.model';
import * as https from 'https';
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
