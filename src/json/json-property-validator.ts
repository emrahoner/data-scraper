const propNameRegexString = '([a-zA-Z0-9_-]+)';
const arrayRegexString = '(\\[\\])';
const propRegexString = `${propNameRegexString}${arrayRegexString}*`;
const pathRegexString = `(${arrayRegexString}+|${propRegexString})(\.${propRegexString})*`;

const propNameRegex = new RegExp(`^${propNameRegexString}$`);
const propRegex = new RegExp(`^${propRegexString}$`);
const pathRegex = new RegExp(`^${pathRegexString}$`);

export function validatePath(path: string): boolean {
  return pathRegex.test(path);
}

export function validateProp(prop: string): boolean {
  return propRegex.test(prop);
}

export function validatePropName(propName: string): boolean {
  return propNameRegex.test(propName);
}
