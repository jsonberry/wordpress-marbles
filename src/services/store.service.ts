import { BehaviorSubject } from 'rxjs';
import { Category, Page, Post, User } from '../api';
import { EntityCache, EntityState } from '../common';

export interface Store {
  CATEGORIES: EntityCache<Category>;
  PAGES: EntityCache<Page>;
  POSTS: EntityCache<Post>;
  USERS: EntityCache<User>;
  selectFeature(type: string): EntityCache<Category | Page | Post | User>;
}

export class StoreService implements Store {
  PAGES = new BehaviorSubject<EntityState<Page> | null>(null);
  POSTS = new BehaviorSubject<EntityState<Post> | null>(null);
  USERS = new BehaviorSubject<EntityState<User> | null>(null);
  CATEGORIES = new BehaviorSubject<EntityState<Category> | null>(null);

  public selectFeature<T>(type: string): EntityCache<T> {
    // put null check here
    // better to create a union for the store types
    return this[type];
  }
}
