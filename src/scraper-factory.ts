import Scraper from './scraper';
import { ScraperOptions, SelectorParser, TraverserFactory } from './types';
import SelectorComparer from './selector-comparer';

class ScraperFactory {
  constructor(
    private selectorParser: SelectorParser,
    private selectorComparer: SelectorComparer,
    private traverserFactory: TraverserFactory,
  ) {}

  create(options: ScraperOptions): Scraper {
    return new Scraper(
      options,
      this.selectorParser,
      this.selectorComparer,
      this.traverserFactory,
    );
  }
}

export default ScraperFactory;
