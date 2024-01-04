export function throttle<T extends unknown[], U>(cb: (..._args: T) => U, delay = 500) {
  let waiting = false;
  let waitingArgs: T | null;

  const timeoutFunc = () => {
    if (waitingArgs == null) {
      waiting = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args: T) => {
    if (waiting) {
      waitingArgs = args;
      return;
    }

    cb(...args);
    waiting = true;
    setTimeout(timeoutFunc, delay);
  };
}
