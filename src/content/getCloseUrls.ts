function querySimilarElements<T extends HTMLElement>(dom: T) {
  const queryArr = [];
  let cur: HTMLElement | null = dom;
  while (cur) {
    const classlist = Array.from(cur.classList);
    queryArr.unshift([cur.tagName, ...classlist].join('.'));
    if (classlist.length > 0) break;
    cur = cur.parentElement;
  }
  if (queryArr.length === 0) return [];
  const selector = queryArr.join(' ');
  return document.querySelectorAll<T>(selector.replace(/(:|\[|\]|,|=|@)/g, '\\$1'));
}

function filterMap<T, K>(array: ArrayLike<T>, callback: (item: T) => K) {
  const n = array.length;
  const result: K[] = [];
  for (let i = 0; i < n; i++) {
    const res = callback(array[i]);
    if (res) result.push(res);
  }
  return result;
}

export function getCloseUrls(dom: any) {
  if (!dom || !(dom instanceof HTMLElement)) return [];
  const achor = dom.closest('a');
  if (!achor) return [];

  return filterMap(querySimilarElements(achor), (item) => item.href);
}
