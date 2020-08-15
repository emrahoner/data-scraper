import { SelectorParser } from './../types';
import { validatePath } from './json-property-validator';
import ValidationError from '../validation-error';
import { Selector } from '../types';

class JsonPathParser implements SelectorParser {
  parse(selectorString: string): Selector[] {
    if (!validatePath(selectorString)) {
      throw new ValidationError(`Path '${selectorString}' is not valid`);
    }
    const path = (selectorString || '').split('.');
    return path.reduce<Selector[]>((prev, curr) => {
      const arraySplit = curr.split('[]');
      if (arraySplit[0] === '') arraySplit.shift();
      return [
        ...prev,
        ...arraySplit.map((item) =>
          item === ''
            ? { tag: '[]', isChild: true }
            : { tag: item, isChild: true },
        ),
      ];
    }, []);
  }
}

export default JsonPathParser;
