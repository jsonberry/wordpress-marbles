import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError, mergeMapTo, mergeMap, reduce, pluck } from 'rxjs/operators';
import { postsDao } from '../model/posts.dao';
import { AxiosResponse } from 'axios';
import { postTransducer } from '../helpers';
import { bodyResTransducer } from '../../common';

export const getAllPostsEffect$: Effect = req$ =>
  req$.pipe(
    mergeMapTo(postsDao.allPosts$),
    pluck<AxiosResponse, any[]>('data'),
    mergeMap(data => data),
    postTransducer,
    reduce((acc, val: any) => ({ ...acc, [val.id]: val })),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
