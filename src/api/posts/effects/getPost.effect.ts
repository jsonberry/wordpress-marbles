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
      const author =  users && users.dictionary[post.author_id];
      return {
        id: post.id,
        title: post.title,
        date: post.date && post.date.created,
        background_color: post.acf && post.acf.background_color,
        summary: post.acf && post.acf.summary,
        primary_tag: post.acf && post.acf.primary_tag,
        additional_tags: post.acf && post.acf.additional_tags,
        case_studies: post.acf && post.acf.case_studies,
        image: null, // setup after the media entity is setup
        author: {
          name: author && author.name,
          id: author && author.id,
        },
        categories: post.categories
          .map(id => categories && categories.dictionary[id].id)
          .join(', '),
        content: post.acf && post.acf.flex_content
      };
    }),
    bodyResTransducer,
    catchError(() =>
      throwError(new HttpError('Post not found', HttpStatus.NOT_FOUND))
    )
  );
