import * as dotenv from 'dotenv';
import { ReflectiveInjector } from 'injection-js';
import {
  CACHE_TOKEN,
  ENDPOINT_TOKEN,
  REDUCER_TOKEN,
  TRANSDUCER_TOKEN,
  URL_BASE_TOKEN
} from './injection-tokens';
import { HttpService } from './http.service';
import {
  pagesCache,
  PagesDao,
  pagesEndpoint,
  pagesReducer,
  pagesTransducer
} from './pages-dao.service';
import {
  postsCache,
  PostsDao,
  postsEndpoint,
  postsReducer,
  postsTransducer
} from './posts-dao.service';
import {
  usersCache,
  UsersDao,
  usersEndpoint,
  usersReducer,
  usersTransducer
} from './users-dao.service';
dotenv.config();

const rootInjector = ReflectiveInjector.resolveAndCreate([
  HttpService,
  { provide: URL_BASE_TOKEN, useValue: process.env.API_BASE }
]);

const pagesInjector = ReflectiveInjector.resolveAndCreate(
  [
    PagesDao,
    { provide: CACHE_TOKEN, useValue: pagesCache },
    { provide: ENDPOINT_TOKEN, useValue: pagesEndpoint },
    { provide: TRANSDUCER_TOKEN, useValue: pagesTransducer },
    { provide: REDUCER_TOKEN, useValue: pagesReducer }
  ],
  rootInjector
);

const postsInjector = ReflectiveInjector.resolveAndCreate(
  [
    PostsDao,
    { provide: CACHE_TOKEN, useValue: postsCache },
    { provide: ENDPOINT_TOKEN, useValue: postsEndpoint },
    { provide: TRANSDUCER_TOKEN, useValue: postsTransducer },
    { provide: REDUCER_TOKEN, useValue: postsReducer }
  ],
  rootInjector
);

const usersInjector = ReflectiveInjector.resolveAndCreate(
  [
    UsersDao,
    { provide: CACHE_TOKEN, useValue: usersCache },
    { provide: ENDPOINT_TOKEN, useValue: usersEndpoint },
    { provide: TRANSDUCER_TOKEN, useValue: usersTransducer },
    { provide: REDUCER_TOKEN, useValue: usersReducer }
  ],
  rootInjector
);

interface AppServices {
  pages: PagesDao;
  posts: PostsDao;
  users: UsersDao;
}

const appServices: AppServices = {
  pages: pagesInjector.get(PagesDao),
  posts: postsInjector.get(PostsDao),
  users: usersInjector.get(UsersDao)
};

export default appServices;
