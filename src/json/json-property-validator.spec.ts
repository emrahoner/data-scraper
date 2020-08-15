import {
  validateProp,
  validatePropName,
  validatePath,
} from './json-property-validator';

describe('Json Property Validator', () => {
  describe('Prop name', () => {
    it(`'asdf' is valid prop name`, () => {
      const propName = 'asdf';
      const expectedResult = true;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf123' is valid prop name`, () => {
      const propName = 'asdf123';
      const expectedResult = true;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf_123' is valid prop name`, () => {
      const propName = 'asdf_123';
      const expectedResult = true;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf-123' is valid prop name`, () => {
      const propName = 'asdf_123';
      const expectedResult = true;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf 123' is not valid prop name`, () => {
      const propName = 'asdf 123';
      const expectedResult = false;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf.123' is not valid prop name`, () => {
      const propName = 'asdf.123';
      const expectedResult = false;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`empty string is not valid prop name`, () => {
      const propName = '';
      const expectedResult = false;
      const validationResult = validatePropName(propName);
      expect(validationResult).toEqual(expectedResult);
    });
  });

  describe('Prop', () => {
    it(`'asdf[]' is a valid prop`, () => {
      const propName = 'asdf[]';
      const expectedResult = true;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf[][][]' is a valid prop`, () => {
      const propName = 'asdf[][][]';
      const expectedResult = true;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'[][][]' is not a valid prop`, () => {
      const propName = '[][][]';
      const expectedResult = false;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`empty is not a valid prop`, () => {
      const propName = '';
      const expectedResult = false;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'sdf[]sdf' is not a valid prop`, () => {
      const propName = 'sdf[]sdf';
      const expectedResult = false;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'[]sdf' is not a valid prop`, () => {
      const propName = '[]sdf';
      const expectedResult = false;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'[].sdf' is not a valid prop`, () => {
      const propName = '[]sdf';
      const expectedResult = false;
      const validationResult = validateProp(propName);
      expect(validationResult).toEqual(expectedResult);
    });
  });

  describe('Path', () => {
    it(`'asdf.123.asd_sd-sad' is a valid path`, () => {
      const propName = 'asdf.123.asd_sd-sad';
      const expectedResult = true;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf[][]' is a valid path`, () => {
      const propName = 'asdf[][]';
      const expectedResult = true;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'[][].asdf[][]' is a valid path`, () => {
      const propName = '[][].asdf[][]';
      const expectedResult = true;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'asdf[][].[][]' is not a valid path`, () => {
      const propName = 'asdf[][].[][]';
      const expectedResult = false;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'[][]..asdf[][]' is not a valid path`, () => {
      const propName = '[][]..asdf[][]';
      const expectedResult = false;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'[][].[][]' is not a valid path`, () => {
      const propName = '[][].[][]';
      const expectedResult = false;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });

    it(`'.' is not a valid path`, () => {
      const propName = '.';
      const expectedResult = false;
      const validationResult = validatePath(propName);
      expect(validationResult).toEqual(expectedResult);
    });
  });
});
