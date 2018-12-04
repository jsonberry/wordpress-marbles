import * as dotenv from 'dotenv';
import { Container, injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntitiesDao, EntityState } from '../../common';
import { HttpService } from '../../services';
import { Post } from './posts.model';
dotenv.config();

@injectable()
export class PostsDao extends EntitiesDao<Post> {
  constructor(http: HttpService) {
    super(http);
  }

  public cache$ = new BehaviorSubject<EntityState<Post> | null>(null);
  public endpoint = `${process.env.API_BASE}/wp/v2/posts`;
  public transducer(stream$) {
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
}

const container = new Container();
container.bind<PostsDao>(PostsDao).toSelf();
container.bind<HttpService>(HttpService).toSelf();
const dao = container.get<PostsDao>(PostsDao);

export default dao;
