import { useState, useCallback } from 'react';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

export function useCopyPage() {
  const [state, setState] = useState<CopyState>('idle');

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy:', err);
        return false;
      }
    },
    [],
  );

  const execute = useCallback(
    async (actionFn: () => void | Promise<boolean>) => {
      setState('copying');
      try {
        const result = await actionFn();
        if (result !== false) {
          setState('copied');
          setTimeout(() => setState('idle'), 2000);
        } else {
          setState('error');
          setTimeout(() => setState('idle'), 2000);
        }
      } catch (error) {
        console.error('Copy error:', error);
        setState('error');
        setTimeout(() => setState('idle'), 2000);
      }
    },
    [],
  );

  const text =
    state === 'copying'
      ? 'Copying...'
      : state === 'copied'
        ? 'Copied!'
        : state === 'error'
          ? 'Error'
          : 'Copy page';

  const isDisabled = state === 'copying';

  return {
    state,
    text,
    execute,
    isDisabled,
    copyToClipboard,
  };
}
