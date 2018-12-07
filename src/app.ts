import { httpListener } from '@marblejs/core';
import { bodyParser$ } from '@marblejs/middleware-body';
import { loggerWithOpts$ } from '@marblejs/middleware-logger';
import 'reflect-metadata';
import { forkJoin, of } from 'rxjs';
import { switchMapTo, tap } from 'rxjs/operators';
import { api$ } from './api';
import { cors$ } from './common';
import appServices from './services';

console.time('Duration:');
of('Hydrating stores...')
  .pipe(
    tap(message => console.log(message)),
    switchMapTo(
      forkJoin(
        appServices.pages
          .newRequest$()
          .pipe(tap(() => console.log('Pages Store Hydrated...'))),
        appServices.posts
          .newRequest$()
          .pipe(tap(() => console.log('Posts Store Hydrated...'))),
        appServices.users
          .newRequest$()
          .pipe(tap(() => console.log('Users Store Hydrated...')))
      )
    )
  )
  .subscribe({
    error(err) {
      console.log(err);
    },

    complete() {
      console.log('Hydration Complete');
      console.timeEnd('Duration');
    }
  });

const middlewares = [cors$, bodyParser$, loggerWithOpts$()];

const effects = [api$];

export const app = httpListener({ middlewares, effects });
