import { Selector } from '../types';
import CssSelectorParser from './css-selector-parser';

describe('Selector Parser', () => {
  let parser: CssSelectorParser;
  beforeAll(() => {
    parser = new CssSelectorParser();
  });

  it('parses tag name', () => {
    const selector = 'div';
    const expected: Selector[] = [
      {
        tag: 'div',
        isChild: false,
      },
    ];
    const result = parser.parse(selector);
    expect(result).toEqual(expected);
  });

  it('parses class names', () => {
    const selector = '.class1.classA';
    const expected: Selector[] = [
      {
        tag: '',
        classes: ['class1', 'classA'],
        isChild: false,
      },
    ];
    const result = parser.parse(selector);
    expect(result).toEqual(expected);
  });

  it('parses id', () => {
    const selector = '#identifierX';
    const expected: Selector[] = [
      {
        tag: '',
        id: 'identifierX',
        isChild: false,
      },
    ];
    const result = parser.parse(selector);
    expect(result).toEqual(expected);
  });

  it('parses descendant two elements', () => {
    const selector = 'div#identifierX span.btn.btn-primary';
    const expected: Selector[] = [
      {
        tag: 'div',
        id: 'identifierX',
        isChild: false,
      },
      {
        tag: 'span',
        classes: ['btn', 'btn-primary'],
        isChild: false,
      },
    ];
    const result = parser.parse(selector);
    expect(result).toEqual(expected);
  });

  it('parses child two elements', () => {
    const selector = 'span.btn.btn-primary > div#identifierX';
    const expected: Selector[] = [
      {
        tag: 'span',
        classes: ['btn', 'btn-primary'],
        isChild: false,
      },
      {
        tag: 'div',
        id: 'identifierX',
        isChild: true,
      },
    ];
    const result = parser.parse(selector);
    expect(result).toEqual(expected);
  });

  it('parses child two elements without space character', () => {
    const selector = 'span.btn.btn-primary>div#identifierX';
    const expected: Selector[] = [
      {
        tag: 'span',
        classes: ['btn', 'btn-primary'],
        isChild: false,
      },
      {
        tag: 'div',
        id: 'identifierX',
        isChild: true,
      },
    ];
    const result = parser.parse(selector);
    expect(result).toEqual(expected);
  });
});
