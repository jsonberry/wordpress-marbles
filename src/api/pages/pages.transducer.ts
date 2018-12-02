import { map } from 'rxjs/operators';
import { Page } from './pages.model';
import { Observable } from 'rxjs';

export const transducer = (stream$): Observable<Page> =>
  stream$.pipe(
    map((page: any): Page => ({
      id: page.slug,
      _wp_id: page.id,
      title: page.title.rendered,
      status: page.status,
      date: {
        created: page.date,
        modified: page.modified,
      },
      acf: page.acf,
    }))
  );
