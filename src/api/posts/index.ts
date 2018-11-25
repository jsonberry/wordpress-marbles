import { combineRoutes, EffectFactory } from '@marblejs/core';
import { getAllPostsEffect$, getPostEffect$, getPostsEffect$ } from './effects';

export const getPosts$ = EffectFactory.matchPath('/')
  .matchType('GET')
  .use(getPostsEffect$);

export const getPost$ = EffectFactory.matchPath('/:id')
  .matchType('GET')
  .use(getPostEffect$);

export const getAllPosts$ = EffectFactory.matchPath('/all')
  .matchType('GET')
  .use(getAllPostsEffect$);

export const posts$ = combineRoutes('/posts', {
  effects: [getAllPosts$, getPost$, getPosts$]
});
