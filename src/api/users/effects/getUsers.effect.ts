import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import dao from '../users.dao';

export const getUsersEffect$: Effect = req$ =>
  req$.pipe(
    dao.allEntities$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No Users found', HttpStatus.NOT_FOUND))
    )
  );
