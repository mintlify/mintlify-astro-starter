import { useMemo, useCallback } from 'react';
import {
  DuplicateIcon,
  MarkdownIcon,
  ChatGPTIcon,
  ClaudeIcon,
  PerplexityIcon,
} from '../icons/ContextMenuIcons';

export type ContextualOptionItem = {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType | string;
  action: () => void | Promise<boolean>;
  externalLink?: boolean;
};

interface UseContextualOptionsProps {
  pathname: string;
  options?: string[];
}

export function useContextualOptions({
  pathname,
  options: configOptions,
}: UseContextualOptionsProps) {
  const copyPageAsMarkdown = useCallback(async (): Promise<boolean> => {
    try {
      const markdownUrl = `${pathname}.md`;
      const response = await fetch(markdownUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch markdown');
      }

      const markdown = await response.text();
      await navigator.clipboard.writeText(markdown);
      return true;
    } catch (error) {
      console.error('Failed to copy page:', error);
      return false;
    }
  }, [pathname]);

  const viewAsMarkdown = useCallback(() => {
    const markdownPath = `${pathname}.md`;
    window.open(markdownPath, '_blank');
  }, [pathname]);

  const openInAIProvider = useCallback(
    (provider: 'chatgpt' | 'claude' | 'perplexity') => {
      const currentUrl = window.location.href;
      const urlWithoutHash = new URL(currentUrl);
      urlWithoutHash.hash = '';
      const cleanUrl = urlWithoutHash.toString();
      let prompt = `Read from ${cleanUrl}.md so I can ask questions about it.`;

      if (provider === 'chatgpt') {
        prompt = `Read from ${cleanUrl} so I can ask questions about it.`;
        window.open(
          `https://chat.openai.com/?hints=search&q=${encodeURIComponent(prompt)}`,
          '_blank',
        );
      } else if (provider === 'claude') {
        window.open(
          `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
          '_blank',
        );
      } else {
        window.open(
          `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
          '_blank',
        );
      }
    },
    [],
  );

  const allOptions: ContextualOptionItem[] = useMemo(
    () => [
      {
        id: 'copy',
        title: 'Copy page',
        description: 'Copy page as Markdown for LLMs',
        icon: DuplicateIcon,
        action: () => copyPageAsMarkdown(),
      },
      {
        id: 'view',
        title: 'View as markdown',
        description: 'View this page as plain text',
        icon: MarkdownIcon,
        action: viewAsMarkdown,
        externalLink: true,
      },
      {
        id: 'chatgpt',
        title: 'Open in ChatGPT',
        description: 'Ask questions about page',
        icon: ChatGPTIcon,
        action: () => void openInAIProvider('chatgpt'),
        externalLink: true,
      },
      {
        id: 'claude',
        title: 'Open in Claude',
        description: 'Ask questions about page',
        icon: ClaudeIcon,
        action: () => void openInAIProvider('claude'),
        externalLink: true,
      },
      {
        id: 'perplexity',
        title: 'Open in Perplexity',
        description: 'Ask questions about page',
        icon: PerplexityIcon,
        action: () => void openInAIProvider('perplexity'),
        externalLink: true,
      },
    ],
    [copyPageAsMarkdown, viewAsMarkdown, openInAIProvider],
  );

  const options = useMemo(() => {
    if (!configOptions || configOptions.length === 0) return [];

    return configOptions
      .map((optionId) => allOptions.find((o) => o.id === optionId))
      .filter((option): option is ContextualOptionItem => option !== undefined);
  }, [configOptions, allOptions]);

  return {
    options,
  };
}
