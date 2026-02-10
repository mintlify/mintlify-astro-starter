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
        <div className="bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 px-3 py-2 self-end rounded-xl text-base lg:text-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-start">
        <div className="self-start text-gray-800 dark:text-gray-200">
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
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
                'hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer',
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
