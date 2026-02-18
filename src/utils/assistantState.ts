let isAssistantOpen = false;
const listeners = new Set<() => void>();

export function setAssistantOpen(open: boolean) {
  isAssistantOpen = open;
  listeners.forEach((listener) => listener());
}

export function getAssistantOpen() {
  return isAssistantOpen;
}

export function subscribeToAssistant(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
