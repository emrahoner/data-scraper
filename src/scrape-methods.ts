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

export function format(text:string, format: string): string{
  let regexp = new RegExp('\\{0\\}', 'gi')
  return format.replace(regexp, text);
}

export function joinUrl(href: string, url: string) {
  let matches = /^((https?:\/\/)?[^\/]+)\/?/gi.exec(url)
  if(matches && matches[1]) {
      let baseUrl = matches[1]
      let route = url.substring(baseUrl.length + 1)
      let routePath = route ? route.split('/') : []
      if(href.startsWith('/')) {
          return baseUrl + href
      } else {
          let i = 0
          let hrefPath = href.split('/')
          routePath.pop()
          for(; i < hrefPath.length; i++) {
              if(hrefPath[i] === '..') {
                  routePath.pop()
              } else if(hrefPath[i] !== '.') {
                  routePath.push(hrefPath[i])
              }
          }
          return [baseUrl, ...routePath].join('/')
      }
  }
}

export function encodeUrl(text: string) {
  return encodeURIComponent(text)
}
