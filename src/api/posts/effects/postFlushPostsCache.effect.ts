import { Effect } from '@marblejs/core';
import { tap, map } from 'rxjs/operators';
import dao from '../posts.dao';

export const postFlushPostsCacheEffect$: Effect = req$ =>
  req$.pipe(
    tap(_ => dao.flushCache()),
    map(_ => ({body: 'Successfully cleared Posts cache'}))
  );
