import { Inject, Injectable } from 'injection-js';
import { map, reduce } from 'rxjs/operators';
import { Post } from '../api/posts/posts.model';
import { EntitiesDao } from './entities-dao.service';
import { HttpService } from './http.service';
import { URL_BASE_TOKEN } from './injection-tokens';
import { StoreService } from './store.service';

@Injectable()
export class PostsDao extends EntitiesDao<Post> {
  public readonly type = 'POSTS';
  public readonly endpoint = '/wp/v2/posts';
  public readonly reducer = reduce(
    (acc, val: any) => ({ ...acc, [val.id]: val }),
    {}
  );
  public readonly transducer = stream$ =>
    stream$.pipe(
      map(
        (post: any): Post => ({
          _wp_id: post.id,
          id: post.slug,
          title: post.title.rendered,
          excerpt: post.excerpt.rendered,
          date: {
            created: post.date,
            modified: post.modified
          },
          categories: post.categories,
          tags: post.tags,
          author_id: post.author,
          acf: post.acf
        })
      )
    )

  constructor(
    http: HttpService,
    store: StoreService,
    @Inject(URL_BASE_TOKEN) urlBase
  ) {
    super(http, store, urlBase);
  }
}
