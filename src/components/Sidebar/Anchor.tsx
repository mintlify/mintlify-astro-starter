import { useState } from 'react';
import { cn, Icon } from '@mintlify/components';

export type AnchorProps = {
  name: string;
  href: string;
  icon?: string;
  isActive?: boolean;
  color?: string;
};

export function Anchor({
  name,
  href,
  icon = 'book-open',
  isActive = false,
  color,
}: AnchorProps) {
  const [hovering, setHovering] = useState(false);
  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        'ml-4 group flex items-center lg:text-sm lg:leading-6 mb-5 sm:mb-4 font-medium outline-offset-4',
        isActive
          ? '[text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor] text-primary'
          : 'text-gray-600 hover:text-gray-900',
      )}
    >
      <span
        style={{
          width: '24px',
          height: '24px',
          padding: '4px',
          ...((isActive || hovering) && color ? { background: color } : {}),
        }}
        className={cn(
          'mr-4 rounded-md inline-flex items-center justify-center',
          color
            ? ''
            : isActive
              ? 'bg-primary'
              : 'bg-gray-400 group-hover:bg-primary ring-1 ring-gray-950/[0.07]',
        )}
      >
        <Icon
          icon={icon}
          className={cn(isActive || hovering ? 'bg-white' : 'bg-gray-600')}
          overrideColor
          size={16}
        />
      </span>
      {name}
    </a>
  );
}

export function AnchorWithoutContainer({
  name,
  href,
  icon = 'book-open',
  isActive = false,
  color,
}: AnchorProps) {
  const useGradientColor = color?.includes('linear-gradient');

  return (
    <a
      href={href}
      style={isActive && useGradientColor ? { color: color } : {}}
      className={cn(
        'pl-4 group flex items-center lg:text-sm lg:leading-6 mb-3 gap-3.5',
        isActive
          ? ['font-semibold', !useGradientColor ? 'text-primary' : '']
          : 'text-gray-700 hover:text-gray-900',
      )}
    >
      <span
        style={{ width: '20px', height: '20px', padding: '2px' }}
        className={cn(
          'inline-flex items-center justify-center rounded',
          isActive ? 'bg-primary' : 'bg-gray-400 group-hover:bg-gray-900',
        )}
      >
        <Icon
          icon={icon.toLowerCase()}
          className={cn(
            isActive ? 'bg-white' : 'bg-gray-600 group-hover:bg-white',
          )}
          overrideColor
          size={12}
        />
      </span>
      <span>{name}</span>
    </a>
  );
}
