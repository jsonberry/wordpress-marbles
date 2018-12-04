import * as dotenv from 'dotenv';
import { BehaviorSubject } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { EntitiesDao, EntityState, CACHE_TOKEN, ENDPOINT_TOKEN, TRANSDUCER_TOKEN, REDUCER_TOKEN } from '../../common';
import { Post } from './posts.model';
import { ReflectiveInjector, Injectable, Inject } from 'injection-js';
import { HttpService } from '../../services';
dotenv.config();

export const cache = new BehaviorSubject<EntityState<Post> | null>(null);
export const endpoint = `${process.env.API_BASE}/wp/v2/posts`;
export function transducer(stream$) {
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
export const reducer = reduce((acc, val: any) => ({ ...acc, [val.id]: val }), {});

@Injectable()
export class PostsDao extends EntitiesDao<Post> {
  constructor(
    http: HttpService,
    @Inject(CACHE_TOKEN) cache,
    @Inject(ENDPOINT_TOKEN) endpoint,
    @Inject(TRANSDUCER_TOKEN) transducer,
    @Inject(REDUCER_TOKEN) reducer,
  ) {
    super(
      http,
      cache,
      endpoint,
      transducer,
      reducer,
    );
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  HttpService,
  PostsDao,
  { provide: CACHE_TOKEN, useValue: cache },
  { provide: ENDPOINT_TOKEN, useValue: endpoint},
  { provide: TRANSDUCER_TOKEN, useValue: transducer },
  { provide: REDUCER_TOKEN, useValue: reducer },
]);

export default injector.get(PostsDao);
