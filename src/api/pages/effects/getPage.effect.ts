import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { pageQuery$ } from '../pages.queries';

export const getPageEffect$: Effect = req$ =>
  req$.pipe(
    pageQuery$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Page not found', HttpStatus.NOT_FOUND))
    )
  );
