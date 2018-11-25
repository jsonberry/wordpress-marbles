import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { catchError, mergeMap, mergeMapTo, pluck, reduce } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsDao } from '../model/posts.dao';

export const getAllPostsEffect$: Effect = req$ =>
  req$.pipe(
    mergeMapTo(postsDao.allPosts$),
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
