import { HttpRequest } from '@marblejs/core';
import { Observable, of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { EntityCache, EntityRequest } from '../models';

export const allEntitiesQuery$ = <T>(
  cache$: EntityCache<T>,
  newRequestQuery$: EntityRequest<T>
) => (req$: Observable<HttpRequest>): EntityRequest<T> =>
  req$.pipe(
    withLatestFrom(cache$),
    switchMap(([, cache]) => (cache ? of(cache) : newRequestQuery$))
  );
