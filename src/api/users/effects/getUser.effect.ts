import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import appServices from '../../../services';

export const getUserEffect$: Effect = req$ =>
  req$.pipe(
    appServices.users.entity$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('User not found', HttpStatus.NOT_FOUND))
    )
  );
