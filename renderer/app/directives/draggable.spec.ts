import { DraggableDirective } from './draggable';

describe('DraggableDirective', () => {
  let mockElementRef: any;

  beforeEach(() => {
    mockElementRef = {
      nativeElement: document.body
    };
  });

  test('Directive is created', () => {
    const draggable = new DraggableDirective(mockElementRef);
    expect(draggable).toBeTruthy();
  });
});
