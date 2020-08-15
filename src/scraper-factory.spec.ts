import ScraperFactory from './scraper-factory';
import JsonPathParser from './json/json-path-parser';
import JsonObjectTraverserFactory from './json/json-object-traverser-factory';
import CssSelectorParser from './html/css-selector-parser';
import DomTraverserFactory from './html/dom-traverser-factory';
import SelectorComparer from './selector-comparer';

describe('Json Scraper Factory', () => {
  let scraperFactory: ScraperFactory;
  beforeAll(async () => {
    const selectorParser = new JsonPathParser();
    const selectorComparer = new SelectorComparer();
    const traverserFactory = new JsonObjectTraverserFactory();
    scraperFactory = new ScraperFactory(
      selectorParser,
      selectorComparer,
      traverserFactory,
    );
  });

  it('creates Json Scraper', async () => {
    const scraper = scraperFactory.create({ scrape: {} });
    expect(scraper).not.toBeNull();
  });
});

describe('Html Scraper Factory', () => {
  let scraperFactory: ScraperFactory;
  beforeAll(async () => {
    const selectorParser = new CssSelectorParser();
    const selectorComparer = new SelectorComparer();
    const traverserFactory = new DomTraverserFactory();
    scraperFactory = new ScraperFactory(
      selectorParser,
      selectorComparer,
      traverserFactory,
    );
  });

  it('creates Html Scraper', async () => {
    const scraper = scraperFactory.create({ scrape: {} });
    expect(scraper).not.toBeNull();
  });
});
