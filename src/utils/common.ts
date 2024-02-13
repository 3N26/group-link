export const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

export const allFulfilledSettled = <T>(values: T[]) =>
  Promise.allSettled(values).then((settledResult) => {
    return settledResult.reduce<Awaited<T>[]>((acm, item) => {
      isFulfilled(item) && acm.push(item.value);
      return acm;
    }, []);
  });

export function pull<T>(array: T[], ...items: T[]) {
  const set = new Set(items);
  return array.filter((item) => !set.has(item));
}

