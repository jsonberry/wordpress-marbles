import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { allPostsQuery$ } from '../posts.queries';

export const getPostsEffect$: Effect = req$ =>
  req$.pipe(
    allPostsQuery$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
