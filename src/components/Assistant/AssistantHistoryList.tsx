import { useMemo } from 'react';
import type { UIMessage } from '@ai-sdk/react';
import { ChatItem } from './ChatItem';

interface AssistantHistoryListProps {
  messages: UIMessage[];
  status: 'ready' | 'streaming' | 'submitted' | 'error';
}

const hasVisibleParts = (parts: UIMessage['parts'] | undefined) =>
  parts?.some((part) => part.type === 'text' || part.type === 'tool-search') ??
  false;

function LoadingIndicator() {
  return (
    <div>
      <div className="flex justify-start">
        <div className="self-start text-gray-800">
          <div className="text-sm">
            <div className="flex gap-0.5 items-end h-3 py-2">
              <span className="size-1 bg-zinc-400 rounded-full animate-[dotBounce_1.4s_ease-in-out_infinite]" />
              <span className="size-1 bg-zinc-400 rounded-full animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
              <span className="size-1 bg-zinc-400 rounded-full animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes dotBounce {
            0%, 20%, 100% {
              transform: translateY(0);
            }
            10% {
              transform: translateY(2px);
            }
          }
        `}</style>
      </div>
      <div className="flex justify-start -mt-2">
        <div className="h-8" />
      </div>
    </div>
  );
}

export function AssistantHistoryList({
  messages,
  status,
}: AssistantHistoryListProps) {
  const isLoading = useMemo(() => {
    if (status === 'submitted') return true;
    if (status !== 'streaming') return false;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return false;
    if (lastMessage.role === 'user') return true;

    const lastPart = lastMessage.parts[lastMessage.parts.length - 1];
    return lastPart?.type !== 'text' || !lastPart.text;
  }, [status, messages]);

  const filteredMessages = messages.filter((msg) => msg.role !== 'system');

  return (
    <div className="space-y-4">
      {filteredMessages.map((msg, index) => {
        if (msg.role === 'assistant' && !hasVisibleParts(msg.parts)) {
          return null;
        }

        return (
          <ChatItem
            key={msg.id}
            message={msg}
            isLast={index === filteredMessages.length - 1}
          />
        );
      })}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}
