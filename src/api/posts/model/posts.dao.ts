import axios from 'axios';
import { from, range } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { PostsDao } from './posts.model';

export const endpoint = 'http://localhost/wp-json/wp/v2/posts';

export const postsDao: PostsDao = {
  allPosts$: from(axios.head(endpoint)).pipe(
    switchMap(({ headers }) => range(1, Number(headers['x-wp-totalpages']))),
    mergeMap(page =>
      axios.get(endpoint, {
        params: {
          page
        }
      })
    )
  ),
  posts$: params => from(axios.get(endpoint, { params })),
  post$: id => from(axios.get(`${endpoint}/${id}`))
};
