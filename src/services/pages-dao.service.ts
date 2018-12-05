import { Inject, Injectable } from 'injection-js';
import { BehaviorSubject } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { Page } from '../api/pages/pages.model';
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

export const pagesCache = new BehaviorSubject<EntityState<Page> | null>(null);
export const pagesEndpoint = '/wp/v2/pages';
export function pagesTransducer(stream$) {
  return stream$.pipe(
    map(
      (page: any): Page => ({
        id: page.slug,
        _wp_id: page.id,
        title: page.title.rendered,
        status: page.status,
        date: {
          created: page.date,
          modified: page.modified
        },
        acf: page.acf
      })
    )
  );
}
export const pagesReducer = reduce(
  (acc, val: any) => ({ ...acc, [val.id]: val }),
  {}
);

@Injectable()
export class PagesDao extends EntitiesDao<Page> {
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
