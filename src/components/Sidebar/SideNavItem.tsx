import { cn, Icon } from '@mintlify/components';
import type { NavPage } from '../../lib/navigation';
import {
  getSidebarStyleClassName,
  getPaddingByLevel,
  type SidebarItemStyle,
  type ArrowPosition,
} from './utils';

export interface SideNavItemProps {
  page: NavPage;
  currentPath: string;
  level?: number;
  sidebarItemStyle?: SidebarItemStyle;
  arrowPosition?: ArrowPosition;
}

export function SideNavItem({
  page,
  currentPath,
  level = 0,
  sidebarItemStyle = 'container',
  arrowPosition = 'trailing',
}: SideNavItemProps) {
  const isActive = page.href === currentPath;
  const title = page.title;
  const isOneWord = title.split(' ').length === 1;

  return (
    <li className="relative scroll-m-4 first:scroll-m-20" data-title={title}>
      <a
        href={page.href}
        className={getSidebarStyleClassName(
          sidebarItemStyle,
          isActive,
          isOneWord,
        )}
        style={{
          paddingLeft: getPaddingByLevel(level, arrowPosition),
        }}
        aria-current={isActive ? 'page' : undefined}
      >
        {sidebarItemStyle === 'arrow' && isActive && (
          <Icon
            icon="chevron-right"
            iconLibrary="lucide"
            className="absolute left-0 text-primary group-hover:text-primary"
            size={16}
          />
        )}
        {page.icon && (
          <Icon
            icon={page.icon}
            iconLibrary="lucide"
            className={cn('h-4 w-4', isActive ? 'bg-primary' : 'bg-gray-400')}
            overrideColor={true}
            size={16}
          />
        )}
        <div
          className={cn(
            'flex-1 flex items-center space-x-2.5',
            page.deprecated &&
              'w-full max-w-full overflow-x-hidden justify-between',
          )}
        >
          <div
            className={cn(
              page.deprecated &&
                'min-w-0 max-w-full flex-1 whitespace-nowrap overflow-hidden text-ellipsis',
            )}
          >
            {title}
          </div>
        </div>
      </a>
    </li>
  );
}
