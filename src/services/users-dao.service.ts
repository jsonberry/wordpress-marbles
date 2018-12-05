import { Inject, Injectable } from 'injection-js';
import { BehaviorSubject } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { User } from '../api/users/users.model';
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

export const usersCache = new BehaviorSubject<EntityState<User> | null>(null);
export const usersEndpoint = '/wp/v2/users';
export function usersTransducer(stream$) {
  return stream$.pipe(
    map(
      (user: any): User => ({
        _wp_id: user.id,
        id: user.slug,
        name: user.name,
        description: user.description,
        acf: user.acf
      })
    )
  );
}
export const usersReducer = reduce(
  (acc, val: any) => ({ ...acc, [val.id]: val }),
  {}
);

@Injectable()
export class UsersDao extends EntitiesDao<User> {
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
