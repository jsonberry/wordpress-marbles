import { Inject, Injectable } from 'injection-js';
import { map, reduce } from 'rxjs/operators';
import { User } from '../api/users/users.model';
import { EntitiesDao } from './entities-dao.service';
import { HttpService } from './http.service';
import { URL_BASE_TOKEN } from './injection-tokens';
import { StoreService } from './store.service';

@Injectable()
export class UsersDao extends EntitiesDao<User> {
  public readonly type = 'USERS';
  public readonly endpoint = '/wp/v2/users';
  public readonly reducer = reduce(
    (acc, val: any) => ({ ...acc, [val.id]: val }),
    {}
  );
  public readonly transducer = stream$ =>
    stream$.pipe(
      map(
        (user: any): User => ({
          _wp_id: user.id,
          id: user.id,
          name: user.name,
          description: user.description,
          acf: user.acf
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
