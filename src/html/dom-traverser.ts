import { Traverser, TraverseNode } from '../types';
import { JSDOM } from 'jsdom';

function childNext(current: Element): Element {
  if (!current) return null;
  if (current.children && current.children.length) {
    return current.children.item(0);
  }
  return null;
}

function siblingNext(current: Element): Element {
  if (!current) return null;
  return current.nextElementSibling || null;
}

function getRootRef(currentElement: Element): TraverseNode {
  let current: TraverseNode = { ref: null };
  for (; currentElement; currentElement = currentElement.parentElement) {
    current.ref = getTraverseNodeRef(currentElement);
    if (currentElement.parentElement) {
      current = { ref: null, child: current };
    }
  }
  return current;
}

function getTraverseNodeRef(current: Element) {
  return {
    tagName: current.tagName.toLowerCase(),
    classList:
      current.classList && current.classList.length
        ? Array.from(current.classList)
        : undefined,
    id: current.id || undefined,
    value: current,
  };
}

function getTraverseNode(current: Element) {
  return {
    ref: getTraverseNodeRef(current),
    root: getRootRef(current),
  };
}

class DomTraverser implements Traverser {
  private current: Element;
  private jsdom: JSDOM;
  private resetted: boolean;

  constructor(private htmlString: string) {
    this.jsdom = new JSDOM(htmlString);
    this.reset();
  }

  reset(): void {
    this.resetted = true;
    this.current = this.jsdom.window.document.documentElement;
  }

  next(noChild?: boolean): TraverseNode {
    if (this.resetted) {
      this.resetted = false;
      return getTraverseNode(this.current);
    }
    const child = noChild ? null : childNext(this.current);
    if (child) {
      this.current = child;
    } else {
      const sibling = siblingNext(this.current);
      if (sibling) {
        this.current = sibling;
      } else {
        let parent = this.current,
          parentNext = null;
        do {
          parent = parent.parentElement;
          parentNext = siblingNext(parent);
        } while (!parentNext && parent);
        if (parentNext) {
          this.current = parentNext;
        } else {
          this.current = null;
          return null;
        }
      }
    }

    return getTraverseNode(this.current);
  }
}

export default DomTraverser;
