import { BehaviorSubject } from 'rxjs';
import { Page } from '../api/pages/pages.model';
import { Post } from '../api/posts/posts.model';
import { User } from '../api/users/users.model';
import { EntityCache, EntityState } from '../common';

export interface Store {
  PAGES: EntityCache<Page>;
  POSTS: EntityCache<Post>;
  USERS: EntityCache<User>;
}

export class StoreService {
  PAGES = new BehaviorSubject<EntityState<Page> | null>(null);
  POSTS = new BehaviorSubject<EntityState<Post> | null>(null);
  USERS = new BehaviorSubject<EntityState<User> | null>(null);

  public selectFeature<T>(type: string): EntityCache<T> {
    // put null check here
    // better to create a union for the store types
    return this[type];
  }
}
