import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import appServices from '../../../services';

export const getAssetEffect$: Effect = req$ =>
  req$.pipe(
    appServices.assets.entity$,
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Asset not found', HttpStatus.NOT_FOUND))
    )
  );
