import {
  CompareResult,
  Selector,
  TraverseNode,
  TraverseNodeRef,
  AttributeSelectorOperator,
  AttributeSelector,
  NamedNodeMap,
  Attribute
} from './types';

function compareClassList(refClassList: string[], selectorClassList: string[]) {
  if (!refClassList) refClassList = [];
  return (selectorClassList || []).reduce((prev, curr) => {
    return prev && refClassList.includes(curr);
  }, true);
}

function compareAttribute(refAttribute: Attribute, selectorAttribute: AttributeSelector) {
  switch(selectorAttribute.operator) {
    case AttributeSelectorOperator.equals:
      return !selectorAttribute.value || refAttribute.value === selectorAttribute.value
    case AttributeSelectorOperator.begins:
      return refAttribute.value.startsWith(selectorAttribute.value)
    case AttributeSelectorOperator.ends:
      return refAttribute.value.endsWith(selectorAttribute.value)
    case AttributeSelectorOperator.contains:
      return refAttribute.value.includes(selectorAttribute.value)
    default:
      throw new Error(`The given attribute operation ${ selectorAttribute.operator } is not supported`)
  }
}

function compareAttributeList(refAttributes: NamedNodeMap, selectorAttributeList: AttributeSelector[]) {
  return (selectorAttributeList || []).reduce((prev, curr) => {
    const attr = refAttributes[curr.name]
    return prev && attr && compareAttribute(attr, curr)
  }, true)
}

function isEqual(nodeRef: TraverseNodeRef, selector: Selector) {
  return (
    (!selector.id || (selector.id && nodeRef.id === selector.id)) &&
    (!selector.tag || (selector.tag && nodeRef.tagName === selector.tag)) &&
    (!selector.classes || (selector.classes && compareClassList(nodeRef.classList, selector.classes))) &&
    (!selector.attributes || (selector.attributes && compareAttributeList(nodeRef.attributes, selector.attributes)))
  )
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
