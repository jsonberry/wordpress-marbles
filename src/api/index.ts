import { combineRoutes, EffectFactory } from '@marblejs/core';
import { notFoundEffect$ } from '../common';
import { pages$ } from './pages';
import { posts$ } from './posts';
import { users$ } from './users';

export const notFound$ = EffectFactory.matchPath('*')
  .matchType('*')
  .use(notFoundEffect$);

export const api$ = combineRoutes('/api/v1', [
  pages$,
  posts$,
  users$,
  notFound$
]);
