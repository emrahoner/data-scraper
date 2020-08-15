import { TraverserFactory, Traverser } from '../types';
import JsonObjectTraverser from './json-object-traverser';

class JsonObjectTraverserFactory implements TraverserFactory {
  create(object: any): Traverser {
    return new JsonObjectTraverser(object);
  }
}

export default JsonObjectTraverserFactory;
