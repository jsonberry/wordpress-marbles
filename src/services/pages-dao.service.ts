import { Inject, Injectable } from 'injection-js';
import { map, reduce } from 'rxjs/operators';
import { Page } from '../api/pages/pages.model';
import { EntitiesDao } from './entities-dao.service';
import { HttpService } from './http.service';
import { URL_BASE_TOKEN } from './injection-tokens';
import { StoreService } from './store.service';

@Injectable()
export class PagesDao extends EntitiesDao<Page> {
  public readonly type = 'PAGES';
  public readonly endpoint = '/wp/v2/pages';
  public readonly reducer = reduce(
    (acc, val: any) => ({ ...acc, [val.id]: val }),
    {}
  );
  public readonly transducer = stream$ =>
    stream$.pipe(
      map(
        (page: any): Page => ({
          _wp_id: page.id,
          id: page.slug,
          title: page.title.rendered,
          date: {
            created: page.date,
            modified: page.modified
          },
          acf: page.acf
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
