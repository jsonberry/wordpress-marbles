import axios, { AxiosResponse } from 'axios';
import * as https from 'https';
import { from, Observable, range } from 'rxjs';
import { hasProps } from 'rxjs-toolkit';
import { mergeMap, pluck, reduce, switchMap, tap } from 'rxjs/operators';
import { EntityCache, EntityRequest } from '../models';

const http = axios.create({
  // consider creating a DI token for this with Inversify
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // this helps get around self signed cert validation errors in Node
  })
});

export const entitiesRequest$ = <T>(
  endpoint: string, // TODO create an enum or some similar mechanism for typing endpoints
  transducer: (stream$: Observable<any>) => Observable<T>,
  cache$: EntityCache<T>
): EntityRequest<T> =>
  from(http.head(endpoint)).pipe(
    switchMap(({ headers }) => range(1, Number(headers['x-wp-totalpages']))),
    mergeMap(page =>
      http.get(endpoint, {
        params: {
          page
        }
      })
    ),
    hasProps('data'),
    pluck<AxiosResponse, any[]>('data'),
    mergeMap(data => data),
    transducer,
    reduce((acc, val: any) => ({ ...acc, [val.id]: val }), {}), // need to not use any here
    tap(entities => cache$.next(entities)) // rehydrate the cache whenever a new request is made
  );
