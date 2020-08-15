export function value(ref: Element): string {
  return ref.getAttribute('value');
}

export function html(ref: Element): string {
  return ref.innerHTML;
}

export function text(ref: Element): string {
  return ref.textContent;
}

export function href(ref: Element): string {
  return ref.getAttribute('href');
}

export function src(ref: Element): string {
  return ref.getAttribute('src');
}

export function trim(value: string): string {
  return value.trim();
}
