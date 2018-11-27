import { BehaviorSubject } from 'rxjs';

export const postsCache$ = new BehaviorSubject<null | any>(null);
