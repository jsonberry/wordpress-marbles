import * as dotenv from 'dotenv';
import { entitiesRequest$ } from '../common/dao';
import { allEntitiesQuery$, entityQuery$ } from '../common/queries';
import { postsCache$ } from './posts.cache';
import { Post } from './posts.model';
import { transducer } from './posts.transducer';
dotenv.config();

const newPostsRequest$ = entitiesRequest$<Post>(
  `${process.env.API_BASE}/wp/v2/posts`,
  transducer,
  postsCache$
);

export const allPostsQuery$ = allEntitiesQuery$<Post>(
  postsCache$,
  newPostsRequest$
);
export const postQuery$ = entityQuery$<Post>(postsCache$, newPostsRequest$);
