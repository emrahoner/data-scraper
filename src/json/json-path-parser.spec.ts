import JsonPathParser from './json-path-parser';
import ValidationError from '../validation-error';

describe('Json Path Parser', () => {
  let pathParser: JsonPathParser;
  beforeAll(() => {
    pathParser = new JsonPathParser();
  });

  it(`parses 'asdf.123.asd_sd-sad'`, () => {
    const propName = 'asdf.123.asd_sd-sad';
    const expectedResult = [
      { tag: 'asdf', isChild: true },
      { tag: '123', isChild: true },
      { tag: 'asd_sd-sad', isChild: true },
    ];
    const result = pathParser.parse(propName);
    expect(result).toEqual(expectedResult);
  });

  it(`parses 'asdf[][]'`, () => {
    const propName = 'asdf[][]';
    const expectedResult = [
      { tag: 'asdf', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
    ];
    const result = pathParser.parse(propName);
    expect(result).toEqual(expectedResult);
  });

  it(`parses 'asdf[][].1234.qwer_zxcv'`, () => {
    const propName = 'asdf[][].1234.qwer_zxcv';
    const expectedResult = [
      { tag: 'asdf', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '1234', isChild: true },
      { tag: 'qwer_zxcv', isChild: true },
    ];
    const result = pathParser.parse(propName);
    expect(result).toEqual(expectedResult);
  });

  it(`parses '[][].asdf[][]'`, () => {
    const propName = '[][].asdf[][]';
    const expectedResult = [
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: 'asdf', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
    ];
    const result = pathParser.parse(propName);
    expect(result).toEqual(expectedResult);
  });

  it(`parses '[][].asdf[][].1234[][][]'`, () => {
    const propName = '[][].asdf[][].1234[][][]';
    const expectedResult = [
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: 'asdf', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '1234', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
    ];
    const result = pathParser.parse(propName);
    expect(result).toEqual(expectedResult);
  });

  it(`throws validation error for path 'asdf[][].[][]'`, () => {
    const propName = 'asdf[][].[][]';
    expect(() => {
      pathParser.parse(propName);
    }).toThrowError(ValidationError);
  });

  it(`throws validation error for path '[][]..asdf[][]'`, () => {
    const propName = '[][]..asdf[][]';
    expect(() => {
      pathParser.parse(propName);
    }).toThrowError(ValidationError);
  });

  it(`throws validation error for path '[][].[][]'`, () => {
    const propName = '[][].[][]';
    expect(() => {
      pathParser.parse(propName);
    }).toThrowError(ValidationError);
  });

  it(`throws validation error for path '.'`, () => {
    const propName = '.';
    expect(() => {
      pathParser.parse(propName);
    }).toThrowError(ValidationError);
  });
});
