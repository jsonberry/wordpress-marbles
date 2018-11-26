import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { iif, of, throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { catchError, mergeMap, pluck, reduce, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsDao } from '../model/posts.dao';
import { postsStore$ } from '../store';


const newRequest$ = postsDao.allPosts$.pipe(
  hasProps('data'),
  pluck<AxiosResponse, any[]>('data'),
  mergeMap(data => data),
  postTransducer,
  reduce((acc, val: any) => ({ ...acc, [val.id]: val })),
  tap(posts => postsStore$.next(posts))
);

export const getAllPostsEffect$: Effect = req$ =>
  req$.pipe(
    withLatestFrom(postsStore$),
    switchMap(([, cache]) => iif(
        () => !!cache,
        of(cache),
        newRequest$,
      )
    ),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
