import type { NavNode } from '@mintlify/astro/helpers';
import { unwrapNav } from '@mintlify/astro/helpers';
import { type SidebarItemStyle, type AnchorItem } from './types';
import { SidebarEntries } from './SidebarEntries';
import { Anchors } from './Anchors';

interface SidebarProps {
  navigation: NavNode;
  currentPath: string;
  anchors?: AnchorItem[];
  primaryColor?: string;
  sidebarItemStyle?: SidebarItemStyle;
  showDivider?: boolean;
}

export default function Sidebar({
  navigation,
  currentPath,
  anchors = [],
  primaryColor,
  sidebarItemStyle = 'container',
  showDivider = false,
}: SidebarProps) {
  const entries = unwrapNav(navigation, currentPath);

  return (
    <div className="hidden lg:flex flex-col sticky h-[calc(100vh-7.5rem)] w-[18rem] shrink-0 bg-white isolate">
      <nav className="flex-1 overflow-y-auto pr-8 pb-10">
        <div className="sticky top-0 h-8 z-[5] bg-linear-to-b from-white" />

        {anchors.length > 0 && (
          <Anchors anchors={anchors} primaryColor={primaryColor} />
        )}

        <SidebarEntries
          entries={entries}
          currentPath={currentPath}
          sidebarItemStyle={sidebarItemStyle}
          showDivider={showDivider}
        />
      </nav>
    </div>
  );
}
