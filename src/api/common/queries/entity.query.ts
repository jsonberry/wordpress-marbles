import { HttpRequest } from '@marblejs/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EntityCache, EntityRequest } from '../models';

export const entityQuery$ = <T>(
  cache$: EntityCache<T>,
  newRequestQuery$: EntityRequest<T>
) => (req$: Observable<HttpRequest>): Observable<T> =>
  req$.pipe(
    withLatestFrom(cache$),
    switchMap(([req, cache]) => {
      if (!cache || !cache[req.params.id]) {
        return newRequestQuery$.pipe(map(cache => cache[req.params.id]));
      }

      return of(cache[req.params.id]);
    })
  );
