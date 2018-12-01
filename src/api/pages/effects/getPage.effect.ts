import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { bodyResTransducer } from '../../common';
import { pagesCache$ } from '../pages.cache';
import { newPagesRequest$ } from '../pages.dao';

export const getPageEffect$: Effect = req$ =>
  req$.pipe(
    withLatestFrom(pagesCache$),
    switchMap(([req, cache]) => {
      if (!cache || !cache[req.params.id]) {
        return newPagesRequest$.pipe(map(cache => cache[req.params.id]));
      }

      return of(cache[req.params.id]);
    }),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Page not found', HttpStatus.NOT_FOUND))
    )
  );
