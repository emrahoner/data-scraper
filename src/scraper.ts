import {
  ScraperOptions,
  CompareResult,
  ScrapeOptions,
  TraverseNode,
  SelectorParser,
  TraverserFactory,
  Selector,
  ScrapeMethod,
  ScrapeMethodInfo,
} from './types';
import SelectorComparer from './selector-comparer';
import * as scrapeMethods from './scrape-methods';

interface ScrapingContext {
  prop: string;
  value?: any;
  isArray: boolean;
  isValue: any;
  method?: ScrapeMethod | ScrapeMethodInfo | Array<ScrapeMethodInfo|ScrapeMethod>;
  isEqual?: boolean;
}

function getValue(value: any, methods: ScrapeMethod | ScrapeMethodInfo | Array<ScrapeMethod|ScrapeMethodInfo>): any {
  if (!methods) return value;
  let methodList: ScrapeMethodInfo[];
  if (methods) {
    methodList = Array.isArray(methods) ? 
      methods.map(x => (typeof x === 'string' ? { name: x } : x)) : 
      [typeof methods === 'string' ? { name: methods } : methods];
  }
  return (methodList || []).reduce((value, method) => {
    return scrapeMethods[method.name].apply(null, [value, ...(method.params || [])]);
  }, value);
}

class Scraper {
  private skipSelectors: Selector[][];
  constructor(
    private options: ScraperOptions,
    private selectorParser: SelectorParser,
    private selectorComparer: SelectorComparer,
    private traverserFactory: TraverserFactory,
  ) {
    this.skipSelectors = (this.options.skip || []).map((skipPath) =>
      this.selectorParser.parse(skipPath),
    );
  }

  scrape<T>(object: any): T {
    const traverser = this.traverserFactory.create(object);
    let next: TraverseNode;
    const scrapedObject: any = {};
    while ((next = traverser.next())) {
      if (!this.skip(next)) {
        const contextsArray = this.findContexts(next, this.options.scrape);
        for (const contexts of contextsArray) {
          let ref = scrapedObject;
          for (const context of contexts) {
            if (context.isValue) {
              if (context.isArray && !ref[context.prop]) {
                ref[context.prop] = [];
              }
              const value = getValue(context.value, context.method);
              if (context.isArray) {
                ref[context.prop].push(value);
              } else {
                ref[context.prop] = value;
              }
              break;
            } else {
              if (!ref[context.prop]) {
                if (context.isArray) {
                  ref[context.prop] = [{}];
                } else {
                  ref[context.prop] = {};
                }
              } else if (context.isEqual && context.isArray) {
                ref[context.prop].push({});
              }
              if (Array.isArray(ref[context.prop])) {
                ref = ref[context.prop][ref[context.prop].length - 1];
              } else {
                ref = ref[context.prop];
              }
            }
          }
        }
      }
    }
    return scrapedObject;
  }

  private findContexts(
    traverseNode: TraverseNode,
    options: ScrapeOptions,
    selectors?: Selector[],
  ): ScrapingContext[][] {
    const result: ScrapingContext[][] = [];
    for (const key in options) {
      const option = options[key];
      const optionSelectors = this.selectorParser.parse(option.selector);
      const allSelectors = [...(selectors || []), ...optionSelectors];
      const compare = this.selectorComparer.compare(traverseNode, allSelectors);
      if (compare === CompareResult.Equal) {
        const childContexts = this.findContexts(
          traverseNode,
          option.child,
          allSelectors,
        );
        if (childContexts && childContexts.length) {
          for (const childContext of childContexts) {
            result.push([
              {
                prop: key,
                isArray: !!option.isArray,
                isValue: !option.child,
                value: option.child ? null : traverseNode.ref.value,
                method: option.method,
                isEqual: true,
              },
              ...childContext,
            ]);
          }
        } else {
          result.push([
            {
              prop: key,
              isArray: !!option.isArray,
              isValue: !option.child,
              value: option.child ? null : traverseNode.ref.value,
              method: option.method,
              isEqual: true,
            },
          ]);
        }
      } else if (compare === CompareResult.Child) {
        const childContexts = this.findContexts(
          traverseNode,
          option.child,
          allSelectors,
        );
        for (const childContext of childContexts) {
          result.push([
            {
              prop: key,
              isArray: !!option.isArray,
              isValue: !option.child,
              value: option.child ? null : traverseNode.ref.value,
              method: option.method,
            },
            ...childContext,
          ]);
        }
      }
    }
    return result;
  }

  private skip(node: TraverseNode): boolean {
    if (!this.skipSelectors) return false;
    for (const skipSelector of this.skipSelectors) {
      const compareResult = this.selectorComparer.compare(node, skipSelector);
      if (compareResult === CompareResult.Equal) {
        return true;
      }
    }
    return false;
  }
}

export default Scraper;
