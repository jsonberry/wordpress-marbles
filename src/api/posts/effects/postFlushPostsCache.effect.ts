import { Effect } from '@marblejs/core';
import { tap, map } from 'rxjs/operators';
import { postsCache$ } from '../posts.cache';

export const postFlushPostsCacheEffect$: Effect = req$ =>
  req$.pipe(
    tap(_ => postsCache$.next(null)),
    map(_ => ({body: 'Successfully cleared Posts cache'}))
  );
