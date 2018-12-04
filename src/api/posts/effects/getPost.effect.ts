import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import dao from '../posts.dao';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    dao.entity$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
