import { toggleAssistant } from './events';

export const SparklesIcon = ({ className }: { className?: string }) => (
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

export function AssistantButton() {
  return (
    <button
      onClick={toggleAssistant}
      type="button"
      className="flex items-center justify-center gap-1.5 pl-3 pr-3.5 h-9 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:brightness-[1.1] dark:ring-1 dark:hover:brightness-[1.25] ring-1 ring-gray-400/20 hover:ring-gray-600/25 dark:ring-gray-600/30 dark:hover:ring-gray-500/30 transition-all"
      aria-label="Toggle AI Assistant"
    >
      <SparklesIcon className="size-4 shrink-0 text-gray-700 hover:text-gray-800 dark:text-gray-400 hover:dark:text-gray-200" />
      <span className="text-sm text-gray-500 dark:text-white/50 whitespace-nowrap">
        Ask AI
      </span>
    </button>
  );
}
