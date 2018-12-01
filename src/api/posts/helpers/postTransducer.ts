import { map } from 'rxjs/operators';
import { Post } from '../posts.model';

export const postTransducer = stream$ =>
  stream$.pipe(
    map((post: any): Post => ({
      id: post.slug,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      date: {
        created: post.date,
        modified: post.modified,
      },
      categories: post.categories,
      tags: post.tags,
      status: post.status,
      author_id: post.author,
      _wp_id: post.id,
      acf: post.acf,
    }))
  );
