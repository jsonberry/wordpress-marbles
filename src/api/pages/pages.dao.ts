import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { from, range } from 'rxjs';
import { mergeMap, switchMap, pluck, reduce, tap } from 'rxjs/operators';
import { PagesDao, Page } from './pages.model';
import * as https from 'https';
import { hasProps } from 'rxjs-toolkit';
import { pageTransducer } from './helpers';
import { pagesCache$ } from './pages.cache';
dotenv.config(); // this needs to be moved out and injected correctly

const http = axios.create({ // consider creating a DI token for this with Inversify
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // this helps get around self signed cert validation errors in Node
  })
});

export const endpoint = `${process.env.API_BASE}/wp/v2/pages`;

export const pagesDao: PagesDao = {
  allPages$: from(http.head(endpoint)).pipe(
    switchMap(({ headers }) => range(1, Number(headers['x-wp-totalpages']))),
    mergeMap(page =>
      http.get(endpoint, {
        params: {
          page
        }
      })
    )
  ),
  pages$: params => from(axios.get(endpoint, { params })), // deprecated, won't be hitting WP API for this most likely
  page$: id => from(axios.get(`${endpoint}/${id}`)) // deprecated, won't be hitting WP API for this most likely
};

export const newPagesRequest$ = pagesDao.allPages$.pipe(
  hasProps('data'),
  pluck<AxiosResponse, any[]>('data'),
  mergeMap(data => data),
  pageTransducer,
  reduce((acc, val: Page) => ({ ...acc, [val.id]: val }), {} as Page),
  tap(posts => pagesCache$.next(posts))
);
