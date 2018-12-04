import * as dotenv from 'dotenv';
import { BehaviorSubject } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { EntitiesDao, EntityState, CACHE_TOKEN, ENDPOINT_TOKEN, TRANSDUCER_TOKEN, REDUCER_TOKEN } from '../../common';
import { User } from './users.model';
import { ReflectiveInjector, Injectable, Inject } from 'injection-js';
import { HttpService } from '../../services';
dotenv.config();

export const cache = new BehaviorSubject<EntityState<User> | null>(null);
export const endpoint = `${process.env.API_BASE}/wp/v2/users`;
export function transducer(stream$) {
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
export const reducer = reduce((acc, val: any) => ({ ...acc, [val.id]: val }), {});

@Injectable()
export class UsersDao extends EntitiesDao<User> {
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
  UsersDao,
  { provide: CACHE_TOKEN, useValue: cache },
  { provide: ENDPOINT_TOKEN, useValue: endpoint},
  { provide: TRANSDUCER_TOKEN, useValue: transducer },
  { provide: REDUCER_TOKEN, useValue: reducer },
]);

export default injector.get(UsersDao);
