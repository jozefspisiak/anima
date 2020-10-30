export function filterItemsByQuery(items, query) {
  let { results } = items;

  if (isFilterActive("magical", query)) {
    results = results.filter((res) => res.data.magical);
  }

  return results;
}

export function isFilterActive(name, query) {
  return query[name] === "";
}
