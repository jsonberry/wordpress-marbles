import { map } from 'rxjs/operators';

export const bodyResTransducer = stream$ => stream$.pipe(map(body => ({ body })));
