export function triggerEngineStart() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('start-engine'));
  }
}
