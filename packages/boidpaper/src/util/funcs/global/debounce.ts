export function debounce<T extends unknown[], U>(cb: (..._args: T) => U, delay = 500) {
  let timeout: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
