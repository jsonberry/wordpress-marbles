import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { empty, iif, of, throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { catchError, pluck, switchMap, withLatestFrom } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsDao } from '../posts.dao';
import { postsCache$ } from '../posts.cache';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    withLatestFrom(postsCache$),
    switchMap(([req, cache]) =>
      iif(
        () => {
          if (cache) {
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

