import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postsCache$ } from '../posts.cache';
import { newPostsRequest$ } from '../posts.dao';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    withLatestFrom(postsCache$),
    switchMap(([req, cache]) => {
      if (!cache || !cache[req.params.id]) {
        return newPostsRequest$.pipe(map(cache => cache[req.params.id]));
      }

      return of(cache[req.params.id]);
    }),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
