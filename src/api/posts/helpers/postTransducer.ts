import { map } from 'rxjs/operators';

export const postTransducer = stream$ =>
  stream$.pipe(
    map((post: any) => ({
      id: post.id,
      link: post.link,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      acf: post.acf
    }))
  );
