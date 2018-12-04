import { Effect } from '@marblejs/core';
import { tap, map } from 'rxjs/operators';
import dao from '../users.dao';

export const postFlushUsersCacheEffect$: Effect = req$ =>
  req$.pipe(
    tap(_ => dao.flushCache()),
    map(_ => ({body: 'Successfully cleared Users cache'}))
  );
