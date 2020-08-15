import DomTraverserFactory from './dom-traverser-factory';

describe('Dom Traverser Factory', () => {
  let traverserFactory: DomTraverserFactory;
  beforeAll(async () => {
    traverserFactory = new DomTraverserFactory();
  });

  it('creates traverser', async () => {
    const traverser = traverserFactory.create('');
    expect(traverser).not.toBeNull();
  });
});
