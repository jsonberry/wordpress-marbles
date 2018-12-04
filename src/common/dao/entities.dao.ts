import { HttpRequest } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { injectable } from 'inversify';
import { BehaviorSubject, from, Observable, of, range } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import {
  map,
  mergeMap,
  pluck,
  reduce,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { HttpService } from '../../services';
import { EntityRequest, EntityState } from '../models';

@injectable()
export abstract class EntitiesDao<T> {
  abstract cache$: BehaviorSubject<EntityState<T> | null>;
  abstract endpoint: string;
  abstract transducer(stream$: Observable<any>): Observable<T>;

  constructor(private http: HttpService) {}

  public newRequest$(): EntityRequest<T> {
    return from(this.http.head(this.endpoint)).pipe(
      switchMap(({ headers }) => range(1, Number(headers['x-wp-totalpages']))),
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
      reduce((acc, val: any) => ({ ...acc, [val.id]: val }), {}), // need to not use any here
      tap(entities => this.cache$.next(entities))
    );
  }

  public flushCache() {
    this.cache$.next(null);
  }

  public allEntities$: (
    req$: Observable<HttpRequest>
  ) => Observable<EntityState<T>> = req$ =>
    req$.pipe(
      withLatestFrom(this.cache$),
      switchMap(([, cache]) => (cache ? of(cache) : this.newRequest$()))
    )

  public entity$: (req$: Observable<HttpRequest>) => Observable<T> = req$ =>
    req$.pipe(
      withLatestFrom(this.cache$),
      switchMap(([req, cache]) => {
        if (!cache || !cache[req.params.id]) {
          return this.newRequest$().pipe(map(cache => cache[req.params.id]));
        }

        return of(cache[req.params.id]);
      })
    )
}
