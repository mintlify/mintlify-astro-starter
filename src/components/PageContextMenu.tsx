import { useState, useCallback, useMemo } from 'react';
import { Icon, cn } from '@mintlify/components';
import { useContextualOptions } from '../hooks/useContextualOptions';
import { useCopyPage } from '../hooks/useCopyPage';

interface PageContextMenuProps {
  pathname: string;
  options?: string[];
  className?: string;
}

export function PageContextMenu({
  pathname,
  options: configOptions,
  className,
}: PageContextMenuProps) {
  const { options: rawOptions } = useContextualOptions({
    pathname,
    options: configOptions,
  });
  const [isOpen, setIsOpen] = useState(false);
  const {
    state: copyState,
    text: copyText,
    execute: executeCopy,
    isDisabled,
  } = useCopyPage();

  const wrapAction = useCallback(
    (optionId: string, actionFn: () => void | Promise<boolean>) => {
      return async () => {
        setIsOpen(false);
        if (optionId === 'copy') {
          await executeCopy(actionFn);
        } else {
          void actionFn();
        }
      };
    },
    [executeCopy],
  );

  const options = useMemo(
    () =>
      rawOptions.map((option) => ({
        ...option,
        action: wrapAction(option.id, option.action),
      })),
    [rawOptions, wrapAction],
  );

  if (!options.length) return null;

  const firstOption = options[0];

  return (
    <div className={cn('relative flex items-center shrink-0', className)}>
      <div className="flex items-stretch h-9 relative z-20">
        {firstOption && (
          <button
            className={cn(
              'rounded-l-xl px-3 text-stone-700 border border-stone-200 bg-white hover:bg-stone-50 transition-colors h-full',
              options.length === 1 ? 'rounded-xl' : 'border-r-0',
              copyState !== 'idle' && 'text-stone-600',
            )}
            onClick={() => {
              void firstOption.action();
            }}
            disabled={isDisabled}
            aria-label={firstOption.title}
          >
            <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
              {firstOption.icon && (
                <firstOption.icon className="w-4 h-4 text-stone-600" />
              )}
              <span>
                {firstOption.id === 'copy' ? copyText : firstOption.title}
              </span>
            </div>
          </button>
        )}
        {options.length > 1 && (
          <button
            className="rounded-r-xl border border-stone-200 bg-white hover:bg-stone-50 aspect-square h-full flex items-center justify-center transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="More actions"
          >
            <Icon
              icon="chevron-down"
              iconLibrary="lucide"
              size={16}
              color="currentColor"
              className={cn(
                'transition-transform text-stone-400',
                isOpen && 'rotate-180',
              )}
            />
          </button>
        )}
      </div>
      {isOpen && options.length > 1 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="rounded-2xl absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-auto min-w-[280px] sm:w-64 bg-white border border-stone-200 shadow-lg z-20 overflow-hidden">
            {options.map((option, index) => (
              <button
                key={option.id + index}
                onClick={option.action}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-50 text-left"
              >
                <div className="border border-stone-200 rounded-md p-1.5">
                  {option.icon && (
                    <option.icon className="w-4 h-4 text-stone-500" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-sm font-medium text-stone-800 flex items-center gap-1">
                    {option.title}
                    {option.externalLink && (
                      <Icon
                        icon="arrow-up-right"
                        iconLibrary="lucide"
                        size={12}
                        color="currentColor"
                        className="text-stone-500"
                      />
                    )}
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
