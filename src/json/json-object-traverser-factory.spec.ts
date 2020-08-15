import JsonObjectTraverserFactory from './json-object-traverser-factory';

describe('Json Object Traverser Factory', () => {
  let traverserFactory: JsonObjectTraverserFactory;
  beforeAll(async () => {
    traverserFactory = new JsonObjectTraverserFactory();
  });

  it('creates traverser', async () => {
    const traverser = traverserFactory.create({});
    expect(traverser).not.toBeNull();
  });
});
