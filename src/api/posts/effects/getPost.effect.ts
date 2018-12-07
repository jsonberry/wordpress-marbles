import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError, withLatestFrom, map } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import appServices from '../../../services';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    appServices.posts.entity$,
    withLatestFrom(appServices.store.USERS, appServices.store.CATEGORIES),
    map(([post, users, categories]) => {
      return {
        ...post,
        author: users && users.dictionary[users.index[post.author_id]],
        categories: post.categories
          .map(id => categories && categories.dictionary[id].id)
          .join(', ')
      };
    }),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
