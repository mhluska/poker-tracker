// TODO: Use an actual polyfill. This is gross.
export const polyfillRequestIdleCallback = () => {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback;
  } else {
    return (callback: () => void) => setTimeout(callback, 0);
  }
}
