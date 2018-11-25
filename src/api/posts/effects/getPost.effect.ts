import { Effect, HttpError, HttpRequest, HttpStatus } from '@marblejs/core';
import { AxiosResponse } from 'axios';
import { throwError } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { catchError, pluck, switchMap } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { postTransducer } from '../helpers';
import { postsDao } from '../model/posts.dao';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    pluck<HttpRequest, string>('params', 'id'),
    switchMap(postsDao.post$),
    hasProps('data'),
    pluck<AxiosResponse, any[]>('data'),
    postTransducer,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
