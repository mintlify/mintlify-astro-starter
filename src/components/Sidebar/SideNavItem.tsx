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
          <span
            style={{ width: '20px', height: '20px', padding: '2px' }}
            className={cn(
              'inline-flex items-center justify-center rounded',
              isActive ? 'bg-primary' : 'bg-gray-400',
            )}
          >
            <Icon
              icon={page.icon}
              iconLibrary="lucide"
              className={cn(
                isActive ? 'bg-white' : 'bg-gray-600 group-hover:bg-white',
              )}
              overrideColor
              size={12}
            />
          </span>
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
          {page.deprecated && (
            <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
              Deprecated
            </span>
          )}
        </div>
      </a>
    </li>
  );
}
