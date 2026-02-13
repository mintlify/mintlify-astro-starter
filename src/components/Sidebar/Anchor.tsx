import { cn, Icon } from '@mintlify/components';
import type { AnchorItem } from './types';

export function Anchor({ name, href, icon, color }: AnchorItem) {
  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      style={
        color ? ({ '--anchor-color': color } as React.CSSProperties) : undefined
      }
      className={cn(
        'ml-4 group flex items-center lg:text-sm lg:leading-6 mb-5 sm:mb-4 font-medium outline-offset-4',
        'text-gray-600 hover:text-gray-900',
      )}
    >
      {icon && (
        <span
          className={cn(
            'mr-4 rounded-md inline-flex items-center justify-center w-6 h-6 p-1',
            color
              ? 'group-hover:[background:var(--anchor-color)]'
              : 'bg-gray-400 group-hover:bg-primary ring-1 ring-gray-950/[0.07]',
          )}
        >
          <Icon
            icon={icon}
            className="bg-gray-600 group-hover:bg-white"
            overrideColor
            size={16}
          />
        </span>
      )}
      {name}
    </a>
  );
}
