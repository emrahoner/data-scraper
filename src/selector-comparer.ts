import {
  CompareResult,
  Selector,
  TraverseNode,
  TraverseNodeRef,
} from './types';

function compareClassList(refClassList: string[], selectorClassList: string[]) {
  if (!refClassList) refClassList = [];
  return (selectorClassList || []).reduce((prev, curr) => {
    return prev && refClassList.includes(curr);
  }, true);
}

function isEqual(nodeRef: TraverseNodeRef, selector: Selector) {
  return (
    (!selector.id || (selector.id && nodeRef.id === selector.id)) &&
    (!selector.tag || (selector.tag && nodeRef.tagName === selector.tag)) &&
    (!selector.classes ||
      (selector.classes &&
        compareClassList(nodeRef.classList, selector.classes)))
  );
}

class SelectorComparer {
  compare(node: TraverseNode, selectors: Selector[]): CompareResult {
    let nodeCursor = node.root;
    let index = 0;
    while (nodeCursor && index < selectors.length) {
      const selector = selectors[index];
      if (isEqual(nodeCursor.ref, selector)) {
        index++;
      } else {
        if (selector.isChild) {
          return CompareResult.NotEqual;
        }
      }
      nodeCursor = nodeCursor.child;
    }

    if (index < selectors.length) {
      return CompareResult.Parent;
    } else {
      if (nodeCursor) {
        return CompareResult.Child;
      } else {
        return CompareResult.Equal;
      }
    }
  }
}

export default SelectorComparer;
