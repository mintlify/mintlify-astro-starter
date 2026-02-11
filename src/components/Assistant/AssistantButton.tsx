import { toggleAssistant } from './events';
import { SparklesIcon } from './icons';

export function AssistantButton() {
  return (
    <button
      onClick={toggleAssistant}
      type="button"
      className="flex items-center justify-center gap-1.5 pl-3 pr-3.5 h-9 rounded-xl shadow-sm bg-white ring-1 ring-gray-400/20 hover:ring-gray-600/25 transition-all"
      aria-label="Toggle AI Assistant"
    >
      <SparklesIcon className="size-4 shrink-0 text-gray-700 hover:text-gray-800" />
      <span className="text-sm text-gray-500 whitespace-nowrap">Ask AI</span>
    </button>
  );
}
