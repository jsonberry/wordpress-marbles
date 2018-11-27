import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { iif, of, throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import {
  catchError,
  mergeMap,
  pluck,
  reduce,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsCache$ } from '../posts.cache';
import { postsDao } from '../posts.dao';

const newRequest$ = postsDao.allPosts$.pipe(
  hasProps('data'),
  pluck<AxiosResponse, any[]>('data'),
  mergeMap(data => data),
  postTransducer,
  reduce((acc, val: any) => ({ ...acc, [val.id]: val })),
  tap(posts => postsCache$.next(posts))
);

export const getAllPostsEffect$: Effect = req$ =>
  req$.pipe(
    withLatestFrom(postsCache$),
    switchMap(([, cache]) => iif(() => !!cache, of(cache), newRequest$)),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
