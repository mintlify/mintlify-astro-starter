import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ReactMarkdown from 'react-markdown';

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;
const API_KEY = import.meta.env.PUBLIC_MINTLIFY_ASSISTANT_KEY;

export default function AssistantBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `https://api.mintlify.com/discovery/v2/assistant/${SUBDOMAIN}/message`,
      headers: {
        ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
      },
      body: {
        fp: 'anonymous',
        retrievalPageSize: 5,
        context: [],
      },
    }),
  });

  useEffect(() => {
    if (messagesRef.current && isOpen) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'ready') return;
    sendMessage({ text: input });
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-white border border-black text-sm z-[1000] cursor-pointer hover:bg-gray-50"
      >
        Ask AI
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50"
          />

          <div className="fixed top-0 right-0 bottom-0 w-[450px] max-w-[90vw] bg-white flex flex-col border-l border-black z-[2001]">
            <div className="flex justify-between items-center p-4 border-b border-black font-medium">
              <span>AI Assistant</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>

            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 p-8 m-auto">
                  Ask me anything about this documentation
                </div>
              ) : (
                messages.map((msg, index) => {
                  const text = msg.parts
                    .filter((p) => p.type === 'text')
                    .map((p) => p.text)
                    .join('');

                  const isLastMessage = index === messages.length - 1;
                  const showLoading =
                    isLastMessage &&
                    msg.role === 'assistant' &&
                    isLoading &&
                    !text;

                  return (
                    <div
                      key={msg.id}
                      className={`p-3 text-sm max-w-[85%] whitespace-pre-wrap break-words rounded ${
                        msg.role === 'user'
                          ? 'bg-black text-white self-end'
                          : 'bg-gray-100 self-start'
                      }`}
                    >
                      {showLoading ? (
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      ) : msg.role === 'assistant' ? (
                        <ReactMarkdown>{text}</ReactMarkdown>
                      ) : (
                        text
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative p-4 border-t border-black"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask a question..."
                rows={2}
                className="w-full py-3 pr-12 pl-3 border border-black rounded text-sm resize-none outline-none focus:ring-2 focus:ring-black/20 min-h-[48px]"
              />
              <button
                type="submit"
                disabled={!input.trim() || status !== 'ready'}
                className={`absolute right-7 bottom-7 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center ${
                  !input.trim() || status !== 'ready'
                    ? 'cursor-not-allowed opacity-30'
                    : 'cursor-pointer hover:bg-gray-800'
                }`}
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
