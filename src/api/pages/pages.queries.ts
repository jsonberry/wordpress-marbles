import * as dotenv from 'dotenv';
import { entitiesRequest$ } from '../common/dao';
import { allEntitiesQuery$, entityQuery$ } from '../common/queries';
import { pagesCache$ } from './pages.cache';
import { Page } from './pages.model';
import { transducer } from './pages.transducer';
dotenv.config();

const newPagesRequest$ = entitiesRequest$<Page>(
  `${process.env.API_BASE}/wp/v2/pages`,
  transducer,
  pagesCache$
);

export const allPagesQuery$ = allEntitiesQuery$<Page>(
  pagesCache$,
  newPagesRequest$
);
export const pageQuery$ = entityQuery$<Page>(pagesCache$, newPagesRequest$);
