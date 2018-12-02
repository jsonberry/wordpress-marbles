import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { allPagesQuery$ } from '../pages.queries';

export const getPagesEffect$: Effect = req$ =>
  req$.pipe(
    allPagesQuery$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No pages found', HttpStatus.NOT_FOUND))
    )
  );
