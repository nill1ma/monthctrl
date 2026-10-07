let isRestoring = false;
let cancelPendingDebounce: (() => void) | null = null;

export function setRestoring(value: boolean): void {
  isRestoring = value;
  if (value && cancelPendingDebounce) {
    cancelPendingDebounce(); // cancela debounce pendente ao iniciar restore
    cancelPendingDebounce = null;
  }
}

export function getIsRestoring(): boolean {
  return isRestoring;
}

export function registerDebounceCancel(fn: () => void): void {
  cancelPendingDebounce = fn;
}
