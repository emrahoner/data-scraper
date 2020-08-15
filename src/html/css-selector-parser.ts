import { Selector } from '../types';

function isSelectorSeperator(selector: string, index: number) {
  return ['.', '#', ' ', '>'].includes(selector[index]);
}

function getBasicSelector(selector: string, index: number): string {
  let result = '';
  for (let i = index; i < selector.length; i++) {
    if (isSelectorSeperator(selector, i)) {
      break;
    }
    result += selector[i];
  }
  return result;
}

class CssSelectorParser implements CssSelectorParser {
  parse(selectorString: string): Selector[] {
    if (!selectorString) return [];
    let selector: Selector = null;
    const selectors: Selector[] = [];
    let isChild = false;
    for (let index = 0; index < selectorString.length; index++) {
      const char = selectorString[index];
      if (char === '.') {
        if (!selector) {
          selector = { tag: '', isChild };
        }
        if (!selector.classes) {
          selector.classes = [];
        }
        const className = getBasicSelector(selectorString, index + 1);
        selector.classes.push(className);
        index += className.length;
      } else if (char === '#') {
        if (!selector) {
          selector = { tag: '', isChild };
        }
        const id = getBasicSelector(selectorString, index + 1);
        selector.id = id;
        index += id.length;
      } else if (char === ' ') {
        if (selector) {
          selectors.push(selector);
          isChild = false;
          selector = null;
        }
      } else if (char === '>') {
        if (selector) {
          selectors.push(selector);
          selector = null;
        }
        isChild = true;
      } else {
        const tag = getBasicSelector(selectorString, index);
        selector = { tag, isChild };
        index += tag.length - 1;
      }
    }
    if (selector) {
      selectors.push(selector);
    }
    return selectors;
  }
}

export default CssSelectorParser;
