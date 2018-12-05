import { Inject, Injectable } from 'injection-js';
import { BehaviorSubject } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { Post } from '../api/posts/posts.model';
import { EntityState } from '../common';
import { EntitiesDao } from './entities-dao.service';
import { HttpService } from './http.service';
import {
  CACHE_TOKEN,
  ENDPOINT_TOKEN,
  REDUCER_TOKEN,
  TRANSDUCER_TOKEN,
  URL_BASE_TOKEN
} from './injection-tokens';

export const postsCache = new BehaviorSubject<EntityState<Post> | null>(null);
export const postsEndpoint = '/wp/v2/posts';
export function postsTransducer(stream$) {
  return stream$.pipe(
    map(
      (post: any): Post => ({
        id: post.slug,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered,
        date: {
          created: post.date,
          modified: post.modified
        },
        categories: post.categories,
        tags: post.tags,
        status: post.status,
        author_id: post.author,
        _wp_id: post.id,
        acf: post.acf
      })
    )
  );
}
export const postsReducer = reduce(
  (acc, val: any) => ({ ...acc, [val.id]: val }),
  {}
);

@Injectable()
export class PostsDao extends EntitiesDao<Post> {
  constructor(
    http: HttpService,
    @Inject(CACHE_TOKEN) cache,
    @Inject(URL_BASE_TOKEN) urlBase,
    @Inject(ENDPOINT_TOKEN) endpoint,
    @Inject(TRANSDUCER_TOKEN) transducer,
    @Inject(REDUCER_TOKEN) reducer
  ) {
    super(http, cache, urlBase, endpoint, transducer, reducer);
  }
}
