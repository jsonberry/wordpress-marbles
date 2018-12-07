import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError, withLatestFrom, map } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import appServices from '../../../services';

export const getPostEffect$: Effect = req$ =>
  req$.pipe(
    appServices.posts.entity$,
    withLatestFrom(appServices.store.USERS),
    map(([post, users]) => {
      return {
        ...post,
        author: users && users[post.author_id],
      };
    }),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
