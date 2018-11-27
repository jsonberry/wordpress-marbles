import { combineRoutes, EffectFactory } from '@marblejs/core';
import {
  getAllPostsEffect$,
  getPostEffect$,
  getPostsEffect$,
  // flushPostsCacheEffect$
} from './effects';

export const getPosts$ = EffectFactory.matchPath('/')
  .matchType('GET')
  .use(getPostsEffect$);

export const getPost$ = EffectFactory.matchPath('/:id')
  .matchType('GET')
  .use(getPostEffect$);

export const getAllPosts$ = EffectFactory.matchPath('/all')
  .matchType('GET')
  .use(getAllPostsEffect$);

// export const flushPostsCache$ = EffectFactory.matchPath('/flush')
//   .matchType('POST')
//   .use(flushPostsCacheEffect$);

export const posts$ = combineRoutes('/posts', {
  effects: [getPost$, getPosts$, getAllPosts$]
  // effects: [getPosts$, getPost$, getAllPosts$, flushPostsCache$]
});
