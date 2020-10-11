export interface ScraperOptions {
  scrape: ScrapeOptions;
  skip?: string[];
}

export interface ScrapeOptions {
  [key: string]: ScrapeOption;
}

export interface ScrapeOption {
  selector?: string;
  method?: ScrapeMethod | ScrapeMethodInfo | Array<ScrapeMethodInfo|ScrapeMethod>;
  child?: ScrapeOptions;
  isArray?: boolean;
}

export interface ScrapeMethodInfo {
  name: ScrapeMethod
  params?: any[]
}

export type ScrapeMethod = 'html' | 'text' | 'href' | 'value' | 'src' | 'trim' | 'format' | 'joinUrl' | 'encodeUrl';

export interface TraverseNodeRef {
  tagName: string;
  id?: string;
  classList?: string[];
  value?: any;
}

export interface TraverseNode {
  ref: TraverseNodeRef;
  root?: TraverseNode;
  child?: TraverseNode;
}

export interface Traverser {
  reset(): void;
  next(noChild?: boolean): TraverseNode;
}

export interface TraverserFactory {
  create(object: any): Traverser;
}

// export interface SelectorComparer {
//     compare(currentSelector: string | string[], selectorToCompare: string | string[]): CompareResult
// }

export interface SelectorParser {
  parse(selectorString: string): Selector[];
}

export interface Attribute {
  name: string;
  value: string;
}

export interface Selector {
  tag?: string;
  classes?: string[];
  id?: string;
  attributes?: Attribute[];
  isChild?: boolean;
}

export enum CompareResult {
  NotEqual,
  Equal,
  Parent,
  Child,
}

// export enum Direction {
//     ToChild,
//     ToParentSibling,
//     ToSibling
// }
