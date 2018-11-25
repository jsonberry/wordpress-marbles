import { httpListener } from '@marblejs/core';
import { bodyParser$ } from '@marblejs/middleware-body';
import { loggerWithOpts$ } from '@marblejs/middleware-logger';
import { api$, cors$ } from './api';

const middlewares = [cors$, bodyParser$, loggerWithOpts$()];

const effects = [api$];

export const app = httpListener({ middlewares, effects });
