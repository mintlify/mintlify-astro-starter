import { useMemo } from 'react';
import { AssistantMessage } from './AssistantMessage';

interface MessagePart {
  type: string;
  text?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
}

interface AssistantHistoryListProps {
  messages: Message[];
  status: 'ready' | 'streaming' | 'submitted' | 'error';
}

function LoadingIndicator() {
  return (
    <div>
      <div className="flex justify-start">
        <div className="self-start text-gray-800 dark:text-gray-200">
          <div className="text-sm">
            <div className="flex gap-0.5 items-end h-3 py-2">
              <span className="size-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-[dotBounce_1.4s_ease-in-out_infinite]" />
              <span className="size-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
              <span className="size-1 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
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
      {filteredMessages.map((msg) => {
        const text = msg.parts
          .filter((p) => p.type === 'text')
          .map((p) => ('text' in p ? p.text : ''))
          .join('');

        if (msg.role === 'assistant' && !text.trim()) {
          return null;
        }

        return (
          <AssistantMessage
            key={msg.id}
            role={msg.role as 'user' | 'assistant'}
            content={text}
          />
        );
      })}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}
