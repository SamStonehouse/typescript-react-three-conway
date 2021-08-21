// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

export const map = curry((fn, f) => f.map(fn));

export function replaceAt<T>(array: T[], index: number, value: T): T[] {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}
