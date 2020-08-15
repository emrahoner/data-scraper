import { Traverser, TraverseNode } from '../types';

interface JsonObjectTraverseHistory {
  ref: any;
  parentRef: any;
  refIndex: number;
  refPath: string;
  parentPropList: string[];
}

function childNext(
  current: JsonObjectTraverseHistory,
): JsonObjectTraverseHistory {
  if (current.ref === null) return null;
  if (Array.isArray(current.ref) && current.ref.length) {
    return {
      ref: current.ref[0],
      refIndex: 0,
      refPath: '[]',
      parentRef: current.ref,
      parentPropList: null,
    };
  } else if (typeof current.ref === 'object') {
    const props = Object.keys(current.ref);
    if (props.length) {
      return {
        ref: current.ref[props[0]],
        refIndex: 0,
        refPath: props[0],
        parentRef: current.ref,
        parentPropList: props,
      };
    }
  }
  return null;
}

function siblingNext(
  current: JsonObjectTraverseHistory,
): JsonObjectTraverseHistory {
  if (!current.parentRef) return null;
  if (
    Array.isArray(current.parentRef) &&
    current.refIndex < current.parentRef.length - 1
  ) {
    return {
      ref: current.parentRef[current.refIndex + 1],
      refIndex: current.refIndex + 1,
      refPath: '[]',
      parentRef: current.parentRef,
      parentPropList: null,
    };
  } else if (
    current.parentPropList &&
    current.refIndex < current.parentPropList.length - 1
  ) {
    return {
      ref: current.parentRef[current.parentPropList[current.refIndex + 1]],
      refIndex: current.refIndex + 1,
      refPath: current.parentPropList[current.refIndex + 1],
      parentRef: current.parentRef,
      parentPropList: current.parentPropList,
    };
  }
  return null;
}

function getRootRef(...history: JsonObjectTraverseHistory[]): TraverseNode {
  const root: TraverseNode = { ref: null };
  let current = root;
  for (let i = 0; i < history.length; i++) {
    current.ref = { tagName: history[i].refPath, value: history[i].ref };
    if (i < history.length - 1) {
      current = current.child = { ref: null };
    }
  }
  return root;
}

class JsonObjectTraverser implements Traverser {
  private current: JsonObjectTraverseHistory;
  private history: JsonObjectTraverseHistory[];

  constructor(private jsonObject: any) {
    this.reset();
  }

  reset(): void {
    this.current = {
      ref: this.jsonObject,
      refIndex: null,
      refPath: null,
      parentRef: null,
      parentPropList: null,
    };
    this.history = [];
  }

  next(noChild?: boolean): TraverseNode {
    const child = noChild ? null : childNext(this.current);
    if (child) {
      if (this.current.parentRef) {
        this.history.push(this.current);
      }
      this.current = child;
    } else {
      const sibling = siblingNext(this.current);
      if (sibling) {
        this.current = sibling;
      } else {
        if (!this.history.length) return null;
        let parent,
          parentNext = null;
        do {
          parent = this.history.pop();
          parentNext = siblingNext(parent);
        } while (!parentNext && this.history.length);
        if (parentNext) {
          this.current = parentNext;
        } else {
          return null;
        }
      }
    }

    return {
      ref: {
        tagName: this.current.refPath,
        value: this.current.ref,
      },
      root: getRootRef(...this.history, this.current),
    };
  }
}

export default JsonObjectTraverser;
