import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { empty, iif, of, throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { catchError, pluck, switchMap, withLatestFrom } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsDao } from '../model/posts.dao';
import { postsStore$ } from '../store';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    withLatestFrom(postsStore$),
    switchMap(([req, cache]) =>
      iif(
        () => {
          if (cache !== null) {
            return !!cache[req.params.id];
          }

          return false;
        },
        of(cache ? cache[req.params.id] : empty),
        postsDao.post$(req.params.id).pipe(
          hasProps('data'),
          pluck<AxiosResponse, any[]>('data'),
          postTransducer
        )
      )
    ),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );

