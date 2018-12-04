import { Effect } from '@marblejs/core';
import { tap, map } from 'rxjs/operators';
import dao from '../pages.dao';

export const postFlushPagesCacheEffect$: Effect = req$ =>
  req$.pipe(
    tap(_ => dao.flushCache()),
    map(_ => ({body: 'Successfully cleared Pages cache'}))
  );
