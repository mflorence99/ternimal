import { Subject } from 'rxjs';

export class MockActions<T = any> extends Subject<T> {}
