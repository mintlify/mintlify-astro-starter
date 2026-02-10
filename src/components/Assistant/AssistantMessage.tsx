import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { cn } from '@mintlify/components';

interface AssistantMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function AssistantMessage({ role, content }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (role === 'user') {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="bg-gray-100 text-gray-800 px-3 py-2 self-end rounded-xl text-base lg:text-sm max-w-full break-words">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full min-w-0">
      <div className="flex justify-start max-w-full">
        <div className="self-start text-gray-800 max-w-full min-w-0">
          <div className="text-sm prose prose-sm max-w-none break-words [&_pre]:whitespace-pre-wrap [&_code]:break-words">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      {content && (
        <div className="flex justify-start mt-5">
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                'rounded-lg p-1 text-gray-500',
                'hover:bg-gray-100 cursor-pointer',
              )}
              aria-label="Copy response"
            >
              {copied ? (
                <CheckIcon
                  className="size-4 sm:size-3.5"
                  style={{ color: 'var(--primary)' }}
                />
              ) : (
                <CopyIcon className="size-4 sm:size-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
