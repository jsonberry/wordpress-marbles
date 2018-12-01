import { Effect } from '@marblejs/core';
import { tap, map } from 'rxjs/operators';
import { pagesCache$ } from '../pages.cache';

export const flushPagesCacheEffect$: Effect = req$ =>
  req$.pipe(
    tap(_ => pagesCache$.next(null)),
    map(_ => ({body: 'Successfully cleared Pages cache'}))
  );
