import ScraperFactory from './scraper-factory';
import { ScraperOptions } from './types';
import JsonPathParser from './json/json-path-parser';
import JsonObjectTraverserFactory from './json/json-object-traverser-factory';
import CssSelectorParser from './html/css-selector-parser';
import DomTraverserFactory from './html/dom-traverser-factory';
import SelectorComparer from './selector-comparer';

describe('Scraper', () => {
  describe('JSON', () => {
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

    it('parse flat object to flat object', async () => {
      const config = {
        scrape: {
          targetProp1: {
            selector: 'sourceProp1',
          },
          targetProp2: {
            selector: 'sourceProp2',
          },
        },
      };
      const sourceObject = {
        sourceProp1: 'value1',
        sourceProp2: 'value2',
      };
      const targetObject = {
        targetProp1: 'value1',
        targetProp2: 'value2',
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse nested object to flat object', async () => {
      const config = {
        scrape: {
          targetProp1: {
            selector: 'sourceProp1.nestedPropA.nestedPropB',
          },
          targetProp2: {
            selector: 'sourceProp2.nestedPropC',
          },
        },
      };
      const sourceObject = {
        sourceProp1: {
          nestedPropA: {
            nestedPropB: 'value1',
          },
        },
        sourceProp2: {
          nestedPropC: 'value2',
        },
      };
      const targetObject = {
        targetProp1: 'value1',
        targetProp2: 'value2',
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse flat object to nested object', async () => {
      const config = {
        scrape: {
          parentPropA: {
            child: {
              targetProp1: {
                selector: 'sourceProp1',
              },
              targetProp2: {
                selector: 'sourceProp2',
              },
            },
          },
        },
      };
      const sourceObject = {
        sourceProp1: 'value1',
        sourceProp2: 'value2',
      };
      const targetObject = {
        parentPropA: {
          targetProp1: 'value1',
          targetProp2: 'value2',
        },
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse nested object to nested object', async () => {
      const config = {
        scrape: {
          parentPropA: {
            child: {
              targetProp1: {
                selector: 'sourceProp1.nestedPropA.nestedPropB',
              },
              targetProp2: {
                selector: 'sourceProp2.nestedPropC',
              },
            },
          },
        },
      };
      const sourceObject = {
        sourceProp1: {
          nestedPropA: {
            nestedPropB: 'value1',
          },
        },
        sourceProp2: {
          nestedPropC: 'value2',
        },
      };
      const targetObject = {
        parentPropA: {
          targetProp1: 'value1',
          targetProp2: 'value2',
        },
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse nested object to nested object that have shared parent with a path', async () => {
      const config = {
        scrape: {
          parentPropA: {
            selector: 'sourceProp1',
            child: {
              targetProp1: {
                selector: 'nestedPropA.nestedPropB',
              },
              targetProp2: {
                selector: 'nestedPropC',
              },
            },
          },
        },
      };
      const sourceObject = {
        sourceProp1: {
          nestedPropA: {
            nestedPropB: 'value1',
          },
          nestedPropC: 'value2',
        },
      };
      const targetObject = {
        parentPropA: {
          targetProp1: 'value1',
          targetProp2: 'value2',
        },
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse array', async () => {
      const config = {
        scrape: {
          parentPropA: {
            selector: '[]',
            isArray: true,
            child: {
              targetProp1: {
                selector: 'sourceProp1.nestedPropA.nestedPropB',
              },
              targetProp2: {
                selector: 'sourceProp1.nestedPropC',
              },
            },
          },
        },
      };
      const sourceObject = [
        {
          sourceProp1: {
            nestedPropA: {
              nestedPropB: 'value1',
            },
            nestedPropC: 'value2',
          },
        },
        {
          sourceProp1: {
            nestedPropA: {
              nestedPropB: 'value3',
            },
            nestedPropC: 'value4',
          },
        },
      ];
      const targetObject = {
        parentPropA: [
          {
            targetProp1: 'value1',
            targetProp2: 'value2',
          },
          {
            targetProp1: 'value3',
            targetProp2: 'value4',
          },
        ],
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse as seperate two array when parent does not have path', async () => {
      const config = {
        scrape: {
          parentPropA: {
            selector: 'sourceProp1',
            child: {
              targetProp1: {
                selector: '[].nestedPropA.nestedPropB',
                isArray: true,
              },
              targetProp2: {
                selector: '[].nestedPropC',
                isArray: true,
              },
            },
          },
        },
      };
      const sourceObject = {
        sourceProp1: [
          {
            nestedPropA: {
              nestedPropB: 'value1',
            },
            nestedPropC: 'value2',
          },
          {
            nestedPropA: {
              nestedPropB: 'value3',
            },
            nestedPropC: 'value4',
          },
        ],
      };
      const targetObject = {
        parentPropA: {
          targetProp1: ['value1', 'value3'],
          targetProp2: ['value2', 'value4'],
        },
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parse nested arrays', async () => {
      const config = {
        scrape: {
          parentPropA: {
            selector: '[]',
            isArray: true,
            child: {
              targetProp1: {
                selector: 'sourceProp1.nestedPropA.nestedPropB',
              },
              targetProp2: {
                selector: 'sourceProp1.nestedPropC',
              },
            },
          },
        },
      };
      const sourceObject = [
        {
          sourceProp1: {
            nestedPropA: {
              nestedPropB: 'value1',
            },
            nestedPropC: 'value2',
          },
        },
        {
          sourceProp1: {
            nestedPropA: {
              nestedPropB: 'value3',
            },
            nestedPropC: 'value4',
          },
        },
      ];
      const targetObject = {
        parentPropA: [
          {
            targetProp1: 'value1',
            targetProp2: 'value2',
          },
          {
            targetProp1: 'value3',
            targetProp2: 'value4',
          },
        ],
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(sourceObject);
      expect(parsedObject).toEqual(targetObject);
    });
  });

  describe('HTML', () => {
    let htmlString: string;
    let scraperFactory: ScraperFactory;
    beforeAll(async () => {
      htmlString = `
            <html>
                <body>
                    <div class="container">
                        <div class="header">
                            <nav>
                                <ul>
                                    <li id="menu1">
                                        Menu1
                                    </li>
                                    <li id="menu2">
                                        Menu2
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div class="main">
                            <div id="articleX" class="article">
                                <p>
                                    Sample paragraph 1
                                </p>
                                <p>
                                    Sample paragraph 1 <b>bold text</b> normal text
                                </p>
                                <div>
                                    <img src="/image.jpeg" alt="Image Text">
                                    <img src="../image2.jpeg" alt="Image Text">
                                    <img src="img/image3.jpeg" alt="Image Text">
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            Copyright
                            <span>2020</span>
                        </div>
                    </div>
                </body>
            </html>
            `;
      const selectorParser = new CssSelectorParser();
      const selectorComparer = new SelectorComparer();
      const traverserFactory = new DomTraverserFactory();
      scraperFactory = new ScraperFactory(
        selectorParser,
        selectorComparer,
        traverserFactory,
      );
    });

    it('parses flat object', async () => {
      const config: ScraperOptions = {
        scrape: {
          targetProp1: {
            selector: 'div.footer span',
            method: {
              name: 'html'
            }
          },
          targetProp2: {
            selector: 'div.main img',
            isArray: true,
            method: [
              'src',
              {
                name: 'joinUrl',
                params: [
                  '$value',
                  '$variables["url"]'
                ]
              }
            ]
          },
        },
      };
      const targetObject = {
        targetProp1: '2020',
        targetProp2: [
          'http://www.emon.com/image.jpeg',
          'http://www.emon.com/docs/image2.jpeg',
          'http://www.emon.com/docs/scraping/img/image3.jpeg'
        ]
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(htmlString, { url: 'http://www.emon.com/docs/scraping/introduction.html' });
      expect(parsedObject).toEqual(targetObject);
    });

    it('parses nested object', async () => {
      const config: ScraperOptions = {
        scrape: {
          targetProp1: {
            selector: 'div.footer span',
            method: {
              name: 'html'
            }
          },
          targetProp2: {
            selector: 'div.main img[alt^="Image"]',
            isArray: true,
            method: {
              name: 'src'
            }
          },
          targetProp3: {
            selector: 'div.header',
            child: {
              child1: {
                selector: 'li#menu1',
                method: ['text', 'trim'],
              },
              child2: {
                selector: 'li#menu2',
                method: ['html', 'trim'],
              },
            },
          },
        },
      };
      const targetObject = {
        targetProp1: '2020',
        targetProp2: [
          '/image.jpeg',
          '../image2.jpeg',
          'img/image3.jpeg'
        ],
        targetProp3: {
          child1: 'Menu1',
          child2: 'Menu2',
        },
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(htmlString);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parses array', async () => {
      const config: ScraperOptions = {
        scrape: {
          targetProp1: {
            selector: 'p',
            isArray: true,
            method: ['text', 'trim'],
          },
        },
      };
      const targetObject = {
        targetProp1: [
          'Sample paragraph 1',
          'Sample paragraph 1 bold text normal text',
        ],
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(htmlString);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parses object array', async () => {
      const config: ScraperOptions = {
        scrape: {
          targetProp1: {
            selector: 'p',
            isArray: true,
            child: {
              prop1: {
                method: ['text', 'trim'],
              },
            },
          },
        },
      };
      const targetObject = {
        targetProp1: [
          {
            prop1: 'Sample paragraph 1',
          },
          {
            prop1: 'Sample paragraph 1 bold text normal text',
          },
        ],
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(htmlString);
      expect(parsedObject).toEqual(targetObject);
    });

    it('parses value from parent selected element', async () => {
      const config: ScraperOptions = {
        scrape: {
          targetProp1: {
            selector: 'img',
            isArray: true,
            child: {
              prop1: {
                method: {
                  name: 'attr',
                  params: [
                    '$value',
                    'alt'
                  ]
                },
              },
              prop2: {
                child: {
                  prop3: {
                    method: 'src'
                  }
                }
              }
            },
          },
        },
      };
      const targetObject = {
        targetProp1: [
          {
            prop1: 'Image Text',
            prop2: {
              prop3: '/image.jpeg'
            }
          },
          {
            prop1: 'Image Text',
            prop2: {
              prop3: '../image2.jpeg'
            }
          },
          {
            prop1: 'Image Text',
            prop2: {
              prop3: 'img/image3.jpeg'
            }
          }
        ],
      };
      const scraper = scraperFactory.create(config);
      const parsedObject = scraper.scrape(htmlString);
      expect(parsedObject).toEqual(targetObject);
    });
  });
});
