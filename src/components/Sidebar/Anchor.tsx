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
      <div
        style={
          (isActive || hovering) && color
            ? {
                background: color,
              }
            : {}
        }
        className={cn(
          'mr-4 rounded-md p-1',
          !color && 'group-hover:bg-primary',
          isActive
            ? [color ? '' : 'bg-primary']
            : 'text-gray-400 group-hover:brightness-100 group-hover:ring-0 ring-1 ring-gray-950/[0.07]',
        )}
      >
        <Icon
          icon={icon}
          className={cn(
            'h-4 w-4 group-hover:fill-primary-dark group-hover:bg-white',
            isActive ? 'bg-white' : 'bg-gray-400',
          )}
          overrideColor={true}
          size={16}
        />
      </div>
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
      <Icon
        icon={icon.toLowerCase()}
        iconLibrary="lucide"
        className={cn(
          'h-4 w-4 group-hover:fill-primary-dark group-hover:bg-gray-900',
          isActive ? 'bg-primary group-hover:bg-primary' : 'bg-gray-400',
        )}
        overrideColor={true}
        size={16}
      />
      <span>{name}</span>
    </a>
  );
}
