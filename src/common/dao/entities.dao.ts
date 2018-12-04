import { HttpRequest } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { Inject, Injectable, InjectionToken } from 'injection-js';
import { from, Observable, of, range } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import {
  map,
  mergeMap,
  pluck,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { HttpService } from '../../services';
import { EntityCache, EntityRequest, EntityState } from '../models';

export const CACHE_TOKEN = new InjectionToken('cache');
export const ENDPOINT_TOKEN = new InjectionToken('endpoint');
export const TRANSDUCER_TOKEN = new InjectionToken('transducer');
export const REDUCER_TOKEN = new InjectionToken('reducer');

@Injectable()
export abstract class EntitiesDao<T> {
  constructor(
    private http: HttpService,
    @Inject(CACHE_TOKEN) public cache: EntityCache<T>,
    @Inject(ENDPOINT_TOKEN) private endpoint: string,
    @Inject(TRANSDUCER_TOKEN) private transducer: (stream$: Observable<any>) => Observable<T>,
    @Inject(REDUCER_TOKEN) private reducer
  ) {}

  public newRequest$(): EntityRequest<T> {
    return from(this.http.head(this.endpoint)).pipe(
      switchMap(({ headers }) => {
        const totalPages = Number(headers['x-wp-totalpages']);
        return totalPages > 0 ? range(1, Number(headers['x-wp-totalpages'])) : of(1);
      }),
      mergeMap(page =>
        this.http.get(this.endpoint, {
          params: {
            page
          }
        })
      ),
      hasProps('data'),
      pluck<AxiosResponse, any[]>('data'),
      mergeMap(data => data),
      this.transducer,
      this.reducer,
      tap(entities => this.cache.next(entities))
    );
  }

  public flushCache(): void {
    this.cache.next(null);
  }

  public allEntities$: (
    req$: Observable<HttpRequest>
  ) => Observable<EntityState<T>> = req$ =>
    req$.pipe(
      withLatestFrom(this.cache),
      switchMap(([, cache]) => (cache ? of(cache) : this.newRequest$()))
    )

  public entity$: (req$: Observable<HttpRequest>) => Observable<T> = req$ =>
    req$.pipe(
      withLatestFrom(this.cache),
      switchMap(([req, cache]) => {
        if (!cache || !cache[req.params.id]) {
          return this.newRequest$().pipe(map(cache => cache[req.params.id]));
        }

        return of(cache[req.params.id]);
      })
    )
}
