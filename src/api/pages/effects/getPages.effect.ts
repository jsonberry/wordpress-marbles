import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, switchMapTo } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { pagesCache$ } from '../pages.cache';
import { newPagesRequest$ } from '../pages.dao';

export const getPagesEffect$: Effect = req$ =>
  req$.pipe(
    switchMapTo(pagesCache$),
    switchMap(cache => (cache ? of(cache) : newPagesRequest$)),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No pages found', HttpStatus.NOT_FOUND))
    )
  );
