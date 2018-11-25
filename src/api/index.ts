import { EffectFactory, combineRoutes } from '@marblejs/core';
import { notFoundEffect$ } from './common';
import { posts$ } from './posts';

export const notFound$ = EffectFactory.matchPath('*')
  .matchType('*')
  .use(notFoundEffect$);

export * from './common';

export const api$ = combineRoutes('/api/v1', [
  posts$,
  notFound$
]);
