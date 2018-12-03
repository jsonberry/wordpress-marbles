import { combineRoutes, EffectFactory } from '@marblejs/core';
import {
  postFlushPostsCacheEffect$,
  getPostEffect$,
  getPostsEffect$
} from './effects';

export const flushPostsCache$ = EffectFactory.matchPath('/flush')
  .matchType('POST')
  .use(postFlushPostsCacheEffect$);

export const getPost$ = EffectFactory.matchPath('/:id')
  .matchType('GET')
  .use(getPostEffect$);

export const getPosts$ = EffectFactory.matchPath('/')
  .matchType('GET')
  .use(getPostsEffect$);

export const posts$ = combineRoutes('/posts', {
  effects: [flushPostsCache$, getPost$, getPosts$]
});
