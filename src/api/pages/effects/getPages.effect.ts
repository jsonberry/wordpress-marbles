import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import dao from '../pages.dao';

export const getPagesEffect$: Effect = req$ =>
  req$.pipe(
    dao.allEntities$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No pages found', HttpStatus.NOT_FOUND))
    )
  );
