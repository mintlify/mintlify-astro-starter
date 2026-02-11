import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@mintlify/components';
import { useAssistant } from '../../hooks/useAssistant';
import { AssistantEmptyState } from './AssistantEmptyState';
import { AssistantHistoryList } from './AssistantHistoryList';
import { AssistantTextArea } from './AssistantTextArea';
import { ASSISTANT_EVENTS } from './events';

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const Maximize2Icon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const Minimize2Icon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CHAT_SHEET_MIN_WIDTH = 368;
const CHAT_SHEET_MAX_WIDTH = 576;
const DRAG_THRESHOLD = 10;
const DRAG_THRESHOLD_PX = 100;

export function AssistantSheet() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <AssistantSheetClient />;
}

function AssistantSheetClient() {
  const messagesRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(CHAT_SHEET_MIN_WIDTH);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
  );
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchState = useRef<{
    startY: number;
    startScrollTop: number;
    isDismissGesture: boolean | null;
  }>({ startY: 0, startScrollTop: 0, isDismissGesture: null });

  const {
    input,
    setInput,
    messages,
    status,
    handleSubmit,
    isLoading,
    onClear,
  } = useAssistant();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    setIsDragging(false);
    setDragY(0);

    const scrollContainer = messagesRef.current;

    touchState.current = {
      startY: touch.clientY,
      startScrollTop: scrollContainer?.scrollTop ?? 0,
      isDismissGesture: null,
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const { startY, startScrollTop, isDismissGesture } = touchState.current;
    const deltaY = touch.clientY - startY;

    if (isDismissGesture === false) {
      return;
    }

    if (isDismissGesture === true) {
      e.preventDefault();
      setDragY(Math.max(0, deltaY));
      return;
    }

    if (Math.abs(deltaY) < DRAG_THRESHOLD) {
      return;
    }

    const wasAtTop = startScrollTop <= 0;
    const isMovingDown = deltaY > 0;

    if (wasAtTop && isMovingDown) {
      touchState.current.isDismissGesture = true;
      setIsDragging(true);
      e.preventDefault();
      setDragY(deltaY);
    } else {
      touchState.current.isDismissGesture = false;
    }
  }, []);

  const resetTouchState = useCallback(() => {
    setIsDragging(false);
    setDragY(0);
    touchState.current = {
      startY: 0,
      startScrollTop: 0,
      isDismissGesture: null,
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchState.current.isDismissGesture && dragY > DRAG_THRESHOLD_PX) {
      setIsOpen(false);
    }
    resetTouchState();
  }, [dragY, resetTouchState]);

  const handleTouchCancel = useCallback(() => {
    resetTouchState();
  }, [resetTouchState]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => {
        const isOpening = !prev;
        setShouldFocus(isOpening && !isMobile);
        return isOpening;
      });
    };

    const handleOpen = () => {
      setIsOpen(true);
      setShouldFocus(!isMobile);
    };

    window.addEventListener(ASSISTANT_EVENTS.TOGGLE, handleToggle);
    window.addEventListener(ASSISTANT_EVENTS.OPEN, handleOpen);
    window.addEventListener(ASSISTANT_EVENTS.CLOSE, handleClose);

    return () => {
      window.removeEventListener(ASSISTANT_EVENTS.TOGGLE, handleToggle);
      window.removeEventListener(ASSISTANT_EVENTS.OPEN, handleOpen);
      window.removeEventListener(ASSISTANT_EVENTS.CLOSE, handleClose);
    };
  }, [handleClose]);

  useEffect(() => {
    if (isMobile && isOpen) {
      const scrollY = window.scrollY;

      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.height = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile || !sheetRef.current) return;

    const element = sheetRef.current;

    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [
    isMobile,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  ]);

  const handleSubmitAndFocus = () => {
    handleSubmit();
    setShouldFocus(!isMobile);
  };

  const isMaximized = width >= CHAT_SHEET_MAX_WIDTH;

  const toggleMaximize = useCallback(() => {
    setWidth(isMaximized ? CHAT_SHEET_MIN_WIDTH : CHAT_SHEET_MAX_WIDTH);
  }, [isMaximized]);

  const getOuterClassName = () => {
    if (isMobile) {
      return 'fixed inset-0 z-[100]';
    }
    return cn('sticky top-0 h-screen shrink-0 z-[22]', 'bg-white');
  };

  const sheetContent = (
    <div
      suppressHydrationWarning
      className={cn(getOuterClassName(), 'print:hidden')}
      style={{
        width: isMobile ? undefined : isOpen ? `${width}px` : 0,
        minWidth: isMobile || !isOpen ? undefined : `${CHAT_SHEET_MIN_WIDTH}px`,
        maxWidth: isMobile || !isOpen ? undefined : `${CHAT_SHEET_MAX_WIDTH}px`,
        pointerEvents: isMobile && !isOpen ? 'none' : undefined,
        overflow: !isOpen ? 'hidden' : undefined,
        visibility: !isOpen ? 'hidden' : undefined,
      }}
    >
      {isMobile && (
        <div
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-200 z-[1]',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={handleClose}
        />
      )}

      <div
        ref={sheetRef}
        className={cn(
          'flex flex-col overflow-hidden shrink-0',
          isMobile
            ? 'overscroll-contain bg-white z-[10]'
            : 'h-full bg-white border-l border-gray-200',
          isMobile &&
            !isDragging &&
            'transition-transform duration-200 ease-out',
        )}
        style={
          isMobile
            ? {
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                height: '85vh',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                transform: isOpen
                  ? `translateY(${dragY}px)`
                  : 'translateY(100%)',
                willChange: 'transform',
              }
            : undefined
        }
      >
        {isMobile && (
          <div className="flex justify-center pt-3 touch-none">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>
        )}
        <div
          className={cn(
            'w-full flex flex-col flex-1 min-h-0',
            isMobile ? 'pt-0' : 'pt-3',
          )}
        >
          <div className="flex items-center justify-between pb-3 px-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-primary" />
              <span className="font-medium text-gray-900">Assistant</span>
            </div>

            <div className="flex items-center gap-1">
              {!isMobile && (
                <button
                  onClick={toggleMaximize}
                  className="group hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                  aria-label={isMaximized ? 'Minimize' : 'Maximize'}
                >
                  {isMaximized ? (
                    <Minimize2Icon className="size-4 sm:size-3.5 text-gray-500 group-hover:text-gray-700" />
                  ) : (
                    <Maximize2Icon className="size-4 sm:size-3.5 text-gray-500 group-hover:text-gray-700" />
                  )}
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={onClear}
                  className="group hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                  aria-label="Clear chat"
                >
                  <TrashIcon className="size-4 sm:size-3.5 text-gray-500 group-hover:text-gray-700" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="group hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                aria-label="Close"
              >
                <XIcon className="size-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          </div>

          <div
            ref={messagesRef}
            className="flex flex-col-reverse flex-1 overflow-y-auto overflow-x-hidden relative px-5 min-h-0"
            style={
              isDragging
                ? { overflow: 'hidden', touchAction: 'none' }
                : undefined
            }
          >
            <div className="flex-grow" />
            {messages.length > 0 ? (
              <AssistantHistoryList messages={messages} status={status} />
            ) : (
              <AssistantEmptyState />
            )}
          </div>

          <div className="px-4 pb-4 shrink-0 border-t border-gray-100 pt-4">
            <AssistantTextArea
              value={input}
              onChange={setInput}
              onSubmit={handleSubmitAndFocus}
              isLoading={isLoading}
              disabled={!input.trim() || isLoading}
              shouldFocus={shouldFocus && isOpen}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return createPortal(sheetContent, document.body);
  }

  return sheetContent;
}
