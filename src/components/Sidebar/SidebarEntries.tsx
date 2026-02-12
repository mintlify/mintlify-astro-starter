import type { NavEntry, NavPage, NavGroup } from '../../lib/navigation';
import { isNavPage, isNavGroup } from '../../lib/navigation';
import type { SidebarItemStyle } from './types';
import { SideNavItem } from './SideNavItem';
import { SidebarGroupItem } from './SidebarGroupItem';

function Divider() {
  return (
    <div className="px-1 py-3">
      <div className="h-px w-full bg-gray-100" />
    </div>
  );
}

type GroupedEntry =
  | { kind: 'pages'; pages: NavPage[] }
  | { kind: 'group'; group: NavGroup };

/**
 * Pre-processes a flat list of NavEntry items into a grouped structure
 * where consecutive NavPage entries are bundled together.
 */
function groupEntries(entries: NavEntry[]): GroupedEntry[] {
  const result: GroupedEntry[] = [];

  for (const entry of entries) {
    if (isNavPage(entry)) {
      const last = result[result.length - 1];
      if (last?.kind === 'pages') {
        last.pages.push(entry);
      } else {
        result.push({ kind: 'pages', pages: [entry] });
      }
    } else if (isNavGroup(entry)) {
      result.push({ kind: 'group', group: entry });
    }
  }

  return result;
}

interface SidebarEntriesProps {
  entries: NavEntry[];
  currentPath: string;
  sidebarItemStyle?: SidebarItemStyle;
  showDivider?: boolean;
}

export function SidebarEntries({
  entries,
  currentPath,
  sidebarItemStyle,
  showDivider,
}: SidebarEntriesProps) {
  const grouped = groupEntries(entries);

  return (
    <>
      {grouped.map((item, i) => {
        const spacingClass =
          i > 0 ? (showDivider ? 'my-2' : 'mt-6 lg:mt-8') : undefined;

        if (item.kind === 'pages') {
          return (
            <ul key={item.pages[0].href} className={spacingClass}>
              {item.pages.map((page) => (
                <SideNavItem
                  key={page.href}
                  page={page}
                  currentPath={currentPath}
                  sidebarItemStyle={sidebarItemStyle}
                />
              ))}
            </ul>
          );
        }

        return (
          <div key={`${item.group.group}-${i}`}>
            {showDivider && i > 0 && <Divider />}
            <div className={spacingClass}>
              <SidebarGroupItem
                group={item.group}
                currentPath={currentPath}
                sidebarItemStyle={sidebarItemStyle}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
