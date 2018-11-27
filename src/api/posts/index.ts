import { combineRoutes, EffectFactory } from '@marblejs/core';
import {
  flushPostsCacheEffect$,
  getAllPostsEffect$,
  getPostEffect$,
  getPostsEffect$
} from './effects';

export const getAllPosts$ = EffectFactory.matchPath('/all')
  .matchType('GET')
  .use(getAllPostsEffect$);

export const flushPostsCache$ = EffectFactory.matchPath('/flush')
  .matchType('POST')
  .use(flushPostsCacheEffect$);

export const getPost$ = EffectFactory.matchPath('/:id')
  .matchType('GET')
  .use(getPostEffect$);

export const getPosts$ = EffectFactory.matchPath('/')
  .matchType('GET')
  .use(getPostsEffect$);

export const posts$ = combineRoutes('/posts', {
  effects: [getAllPosts$, flushPostsCache$, getPost$, getPosts$]
});
