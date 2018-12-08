import { Effect, HttpError, HttpStatus } from '@marblejs/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { bodyResTransducer } from '../../../common';
import appServices from '../../../services';

export const getPostsEffect$: Effect = req$ =>
  req$.pipe(
    appServices.posts.allEntities$,
    map(posts => {
      return posts.set.map(post => ({
        id: post.id,
        date: post.date && post.date.created,
        title: post.title,
      }));
    }),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('No posts found', HttpStatus.NOT_FOUND))
    )
  );
