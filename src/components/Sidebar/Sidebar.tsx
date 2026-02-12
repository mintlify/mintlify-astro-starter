import type {
  NavEntry,
  NavNode,
  NavPage,
  NavGroup,
} from '../../lib/navigation';
import { isNavPage, isNavGroup, unwrapNav } from '../../lib/navigation';
import { cn, Icon } from '@mintlify/components';
import {
  getGroupHeaderClassName,
  getMarginTop,
  type SidebarItemStyle,
  type ArrowPosition,
} from './utils';
import { SideNavItem } from './SideNavItem';
import { Anchors, type AnchorItem } from './Anchors';

interface SidebarProps {
  navigation: NavNode;
  currentPath: string;
  anchors?: AnchorItem[];
  primaryColor?: string;
  sidebarItemStyle?: SidebarItemStyle;
  arrowPosition?: ArrowPosition;
  showDivider?: boolean;
  shouldLimitMarginWithAnchors?: boolean;
}

export default function Sidebar({
  navigation,
  currentPath,
  anchors = [],
  primaryColor,
  sidebarItemStyle = 'container',
  arrowPosition = 'trailing',
  showDivider = false,
  shouldLimitMarginWithAnchors = true,
}: SidebarProps) {
  const entries = unwrapNav(navigation, currentPath);

  return (
    <div className="hidden lg:block sticky top-30 h-[calc(100vh-7.5rem)] w-[18rem] shrink-0 bg-white z-[5] isolate">
      <nav className="flex-1 overflow-y-auto pt-2 pb-8 pr-8 pl-2">
        <div className="sticky top-0 h-4 z-[5] bg-gradient-to-b from-white" />

        {anchors.length > 0 && (
          <Anchors anchors={anchors} primaryColor={primaryColor} />
        )}

        <SidebarEntries
          entries={entries}
          currentPath={currentPath}
          sidebarItemStyle={sidebarItemStyle}
          arrowPosition={arrowPosition}
          showDivider={showDivider}
          shouldLimitMarginWithAnchors={shouldLimitMarginWithAnchors}
        />
      </nav>
    </div>
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
