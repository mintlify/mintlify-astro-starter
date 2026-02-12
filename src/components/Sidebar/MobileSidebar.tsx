import { useState, useEffect } from 'react';
import { cn, Icon } from '@mintlify/components';
import type {
  NavEntry,
  NavNode,
  NavPage,
  NavGroup,
} from '../../lib/navigation';
import { isNavPage, isNavGroup, unwrapNav } from '../../lib/navigation';
import {
  getGroupHeaderClassName,
  getMarginTop,
  type SidebarItemStyle,
  type ArrowPosition,
} from './utils';
import { SideNavItem } from './SideNavItem';
import { Anchors, type AnchorItem } from './Anchors';
import { TabsDropdown } from './TabsDropdown';
import type { TabInfo } from '../../lib/navigation';

interface MobileSidebarProps {
  navigation: NavNode;
  currentPath: string;
  logo?: string;
  siteName?: string;
  tabs?: TabInfo[];
  anchors?: AnchorItem[];
  primaryColor?: string;
  sidebarItemStyle?: SidebarItemStyle;
  arrowPosition?: ArrowPosition;
  showDivider?: boolean;
  shouldLimitMarginWithAnchors?: boolean;
}

export function MobileSidebar({
  navigation,
  currentPath,
  logo,
  siteName,
  tabs = [],
  anchors = [],
  primaryColor,
  sidebarItemStyle = 'container',
  arrowPosition = 'trailing',
  showDivider = false,
  shouldLimitMarginWithAnchors = true,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const entries = unwrapNav(navigation, currentPath);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
        aria-label="Open menu"
      >
        <Icon icon="menu" iconLibrary="lucide" size={20} color="currentColor" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-[22rem] bg-white z-50 transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-6">
            {logo ? (
              <img src={logo} alt={siteName || 'Logo'} className="h-7 w-auto" />
            ) : (
              <span className="font-semibold text-gray-900">
                {siteName || 'Menu'}
              </span>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto pt-4 pb-8">
            {/* Tabs dropdown */}
            {tabs.length > 0 && (
              <div className="px-4 mb-4">
                <TabsDropdown tabs={tabs} />
              </div>
            )}

            {/* Anchors aligned slightly left */}
            {anchors.length > 0 && (
              <div className="px-2">
                <Anchors anchors={anchors} primaryColor={primaryColor} />
              </div>
            )}

            {/* Nav items with normal padding */}
            <div className="px-4">
              <SidebarEntries
                entries={entries}
                currentPath={currentPath}
                sidebarItemStyle={sidebarItemStyle}
                arrowPosition={arrowPosition}
                showDivider={showDivider}
                shouldLimitMarginWithAnchors={shouldLimitMarginWithAnchors}
              />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

function SidebarEntries({
  entries,
  currentPath,
  sidebarItemStyle,
  arrowPosition,
  showDivider,
  shouldLimitMarginWithAnchors,
}: {
  entries: NavEntry[];
  currentPath: string;
  sidebarItemStyle?: SidebarItemStyle;
  arrowPosition?: ArrowPosition;
  showDivider?: boolean;
  shouldLimitMarginWithAnchors?: boolean;
}) {
  const Divider = () => {
    return (
      <div className="px-1 py-3">
        <div className="h-px w-full bg-gray-100" />
      </div>
    );
  };

  return (
    <>
      {entries.map((entry, i) => {
        if (isNavPage(entry)) {
          const isPreviousEntryGroup = () => {
            if (i === 0) return false;
            const previousEntry = entries[i - 1];
            return previousEntry && isNavGroup(previousEntry);
          };

          return (
            <ul
              key={entry.href}
              className={cn(
                (isPreviousEntryGroup() || i === 0) &&
                  getMarginTop(
                    i,
                    shouldLimitMarginWithAnchors,
                    false,
                    false,
                    showDivider,
                  ),
              )}
            >
              <SideNavItem
                page={entry}
                currentPath={currentPath}
                sidebarItemStyle={sidebarItemStyle}
                arrowPosition={arrowPosition}
              />
            </ul>
          );
        }

        if (isNavGroup(entry)) {
          return (
            <div key={`${entry.group}-${i}`}>
              {showDivider && i > 0 && <Divider />}
              <div
                className={getMarginTop(
                  i,
                  shouldLimitMarginWithAnchors,
                  false,
                  false,
                  showDivider,
                )}
              >
                <SidebarGroupItem
                  group={entry}
                  currentPath={currentPath}
                  sidebarItemStyle={sidebarItemStyle}
                  arrowPosition={arrowPosition}
                />
              </div>
            </div>
          );
        }

        return null;
      })}
    </>
  );
}

function SidebarGroupItem({
  group,
  currentPath,
  sidebarItemStyle,
  arrowPosition,
}: {
  group: NavGroup;
  currentPath: string;
  sidebarItemStyle?: SidebarItemStyle;
  arrowPosition?: ArrowPosition;
}) {
  return (
    <>
      <div className={getGroupHeaderClassName()}>
        {group.icon && (
          <Icon
            icon={group.icon}
            iconLibrary="lucide"
            className="h-3.5 w-3.5 bg-current"
            overrideColor={true}
            size={14}
          />
        )}
        <h5>{group.group}</h5>
      </div>

      <ul>
        {group.pages.map((entry, i) => {
          if (isNavPage(entry)) {
            return (
              <SideNavItem
                key={i}
                page={entry}
                currentPath={currentPath}
                sidebarItemStyle={sidebarItemStyle}
                arrowPosition={arrowPosition}
              />
            );
          }
          if (isNavGroup(entry)) {
            return (
              <li key={i}>
                <SidebarGroupItem
                  group={entry}
                  currentPath={currentPath}
                  sidebarItemStyle={sidebarItemStyle}
                  arrowPosition={arrowPosition}
                />
              </li>
            );
          }
          return null;
        })}
      </ul>
    </>
  );
}
