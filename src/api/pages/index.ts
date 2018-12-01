import { combineRoutes, EffectFactory } from '@marblejs/core';
import {
  flushPagesCacheEffect$,
  getPagesEffect$,
  getPageEffect$,
} from './effects';

export const flushPagesCache$ = EffectFactory.matchPath('/flush') // consider moving this to a rehydrate endpoint
  .matchType('POST')
  .use(flushPagesCacheEffect$);

export const getPage$ = EffectFactory.matchPath('/:id')
  .matchType('GET')
  .use(getPageEffect$);

export const getPages$ = EffectFactory.matchPath('/')
  .matchType('GET')
  .use(getPagesEffect$);

export const pages$ = combineRoutes('/pages', {
  effects: [flushPagesCache$, getPage$, getPages$]
});
