import { TraverserFactory, Traverser } from '../types';
import DomTraverser from './dom-traverser';

class DomTraverserFactory implements TraverserFactory {
  create(html: string): Traverser {
    return new DomTraverser(html);
  }
}

export default DomTraverserFactory;
