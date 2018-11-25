import { Effect, HttpError, HttpStatus, HttpRequest } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError, map, pluck, switchMap, tap } from 'rxjs/operators';
import { postsDao } from '../model/posts.dao';
import { AxiosResponse } from 'axios';
import { postTransducer } from '../helpers';
import { bodyResTransducer } from '../../common';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    pluck<HttpRequest, string>('params', 'id'),
    switchMap(postsDao.post$),
    pluck<AxiosResponse, any[]>('data'),
    postTransducer,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
