import { cn } from '@mintlify/components';

export type SidebarItemStyle =
  | 'container'
  | 'card'
  | 'border'
  | 'undecorated'
  | 'arrow'
  | 'plain';

export type ArrowPosition = 'leading' | 'trailing' | 'end';

export const getPaddingByLevel = (
  level: number,
  arrowPosition?: ArrowPosition,
) => {
  // level 0 -> 1rem
  // level 1 -> 1.75rem
  // level 2 -> 2.50rem and so on.

  const levelPadding = arrowPosition === 'leading' ? 1.5 : 0.75;

  return `${1 + level * levelPadding}rem`;
};

export const getSidebarStyleClassName = (
  sidebarStyle: SidebarItemStyle | undefined = 'container',
  isActive: boolean,
  isOneWord: boolean,
) => {
  const defaultClassNames = cn(
    'group flex items-center pr-3 py-1.5 cursor-pointer gap-x-3 text-left',
    isOneWord && 'break-words hyphens-auto',
  );

  const sidebarClassNames = {
    container: cn(
      'rounded-xl w-full outline-offset-[-1px]',
      isActive
        ? 'bg-primary/10 text-primary [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]'
        : 'hover:bg-gray-600/5 text-gray-700 hover:text-gray-900',
    ),
    card: cn(
      'ml-4 border-l outline-offset-[-1px]',
      isActive
        ? 'border-primary bg-primary/10 text-primary [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]'
        : 'border-gray-950/5 hover:bg-gray-600/5 text-gray-700 hover:text-gray-900',
    ),
    border: cn(
      'ml-4 border-l py-2 lg:py-1.5 w-[calc(100%-1rem)]',
      isActive
        ? 'border-primary text-primary [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]'
        : 'border-gray-950/5 hover:border-gray-950/20 text-gray-700 hover:text-gray-900',
    ),
    undecorated: cn(
      isActive
        ? 'border-primary text-primary [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]'
        : 'border-gray-950/5 hover:border-gray-950/20 text-gray-700 hover:text-gray-950',
    ),
    arrow: cn(
      isActive
        ? 'border-primary text-primary [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]'
        : 'border-gray-950/5 hover:border-gray-950/20 text-gray-700 hover:text-gray-950',
    ),
    plain: cn(
      isActive
        ? 'text-primary [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]'
        : 'text-gray-950 hover:text-primary',
    ),
  };

  return cn(defaultClassNames, sidebarClassNames[sidebarStyle]);
};

export const getGroupHeaderClassName = () => {
  return cn(
    'flex items-center gap-2.5 pl-4 mb-3.5 lg:mb-2.5 font-semibold',
    'text-gray-900',
  );
};

export const getMarginTop = (
  i: number,
  shouldLimitMarginWithAnchors?: boolean,
  hasAnchors?: boolean,
  hasDropdowns?: boolean,
  showDivider?: boolean,
) => {
  const marginTopClass = 'mt-6 lg:mt-8';
  if (shouldLimitMarginWithAnchors) {
    if (i !== 0 && showDivider) return 'my-2';
    return cn(
      (!Boolean(i === 0 && !hasAnchors) || hasDropdowns) && marginTopClass,
    );
  }
  return marginTopClass;
};
