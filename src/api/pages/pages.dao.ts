import * as dotenv from 'dotenv';
import { Container } from 'inversify';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntitiesDao, EntityState } from '../../common';
import { HttpService } from '../../services';
import { Page } from './pages.model';
dotenv.config();

export class PagesDao extends EntitiesDao<Page> {
  constructor(http: HttpService) {
    super(http);
  }

  public cache$ = new BehaviorSubject<EntityState<Page> | null>(null);
  public endpoint = `${process.env.API_BASE}/wp/v2/pages`;
  public transducer(stream$) {
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
}

const container = new Container();
container.bind<HttpService>(HttpService).toSelf();
container.bind<PagesDao>(PagesDao).toSelf();
const dao = container.get<PagesDao>(PagesDao);

export default dao;
