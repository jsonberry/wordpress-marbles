import * as dotenv from 'dotenv';
import { Injectable, ReflectiveInjector, Inject } from 'injection-js';
import { BehaviorSubject } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { CACHE_TOKEN, ENDPOINT_TOKEN, EntitiesDao, EntityState, REDUCER_TOKEN, TRANSDUCER_TOKEN } from '../../common';
import { HttpService } from '../../services';
import { Page } from './pages.model';
dotenv.config();

export const cache = new BehaviorSubject<EntityState<Page> | null>(null);
export const endpoint = `${process.env.API_BASE}/wp/v2/pages`;
export function transducer(stream$) {
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
export const reducer = reduce((acc, val: any) => ({ ...acc, [val.id]: val }), {});

@Injectable()
export class PagesDao extends EntitiesDao<Page> {
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
  PagesDao,
  { provide: CACHE_TOKEN, useValue: cache },
  { provide: ENDPOINT_TOKEN, useValue: endpoint},
  { provide: TRANSDUCER_TOKEN, useValue: transducer },
  { provide: REDUCER_TOKEN, useValue: reducer },
]);

export default injector.get(PagesDao);
