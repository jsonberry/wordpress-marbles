import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, switchMapTo } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postsCache$ } from '../posts.cache';
import { newPostsRequest$ } from '../posts.dao';

export const getPostsEffect$: Effect = req$ =>
  req$.pipe(
    switchMapTo(postsCache$),
    switchMap(cache => (cache ? of(cache) : newPostsRequest$)),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
