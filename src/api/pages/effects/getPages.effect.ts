import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import appServices from '../../../services';

export const getPagesEffect$: Effect = req$ =>
  req$.pipe(
    appServices.pages.allEntities$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No pages found', HttpStatus.NOT_FOUND))
    )
  );
