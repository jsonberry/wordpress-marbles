import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { catchError, mergeMap, pluck, reduce, switchMap } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsDao } from '../posts.dao';

export const getPostsEffect$: Effect = req$ =>
  req$.pipe(
    pluck('query'),
    switchMap(postsDao.posts$),
    hasProps('data'),
    pluck<AxiosResponse, any[]>('data'),
    mergeMap(data => data),
    postTransducer,
    reduce((acc, val: any) => ({ ...acc, [val.id]: val })),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
