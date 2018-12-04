import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import dao from '../users.dao';

export const getUserEffect$: Effect = req$ =>
  req$.pipe(
    dao.entity$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('User not found', HttpStatus.NOT_FOUND))
    )
  );
