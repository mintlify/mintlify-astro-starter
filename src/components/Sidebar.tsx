import type { NavEntry, NavNode, NavPage, NavGroup } from "../lib/navigation";
import {
  isNavPage,
  isNavGroup,
  unwrapNav,
} from "../lib/navigation";
import { cn } from "../lib/cn";

interface SidebarProps {
  navigation: NavNode;
  currentPath: string;
}

export default function Sidebar({ navigation, currentPath }: SidebarProps) {
  const entries = unwrapNav(navigation, currentPath);

  return (
    <div className="sticky top-30 h-[calc(100vh-7.5rem)] w-[18rem] shrink-0 flex flex-col bg-white z-10">
      <nav className="flex-1 overflow-y-auto pt-4 pb-8 pr-8">
        <SidebarEntries entries={entries} currentPath={currentPath} />
      </nav>
    </div>
  );
}

function SidebarEntries({
  entries,
  currentPath,
}: {
  entries: NavEntry[];
  currentPath: string;
}) {
  return (
    <ul>
      {entries.map((entry, i) => {
        if (isNavPage(entry)) {
          return (
            <SidebarLink
              key={entry.href}
              page={entry}
              isActive={entry.href === currentPath}
            />
          );
        }
        if (isNavGroup(entry)) {
          return (
            <SidebarGroupItem
              key={`${entry.group}-${i}`}
              group={entry}
              currentPath={currentPath}
            />
          );
        }
        return null;
      })}
    </ul>
  );
}

function SidebarLink({
  page,
  isActive,
}: {
  page: NavPage;
  isActive: boolean;
}) {
  return (
    <li>
      <a
        href={page.href}
        className={cn(
          "flex items-center gap-2 py-1.5 px-4 text-sm leading-6 no-underline rounded-md mx-1.5 transition-colors duration-150",
          isActive
            ? "font-medium text-(--sidebar-primary) bg-(--sidebar-primary)/5"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {page.title}
        </span>

        {page.tag && (
          <span className="shrink-0 text-[10px] font-semibold px-1.5 py-px rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
            {page.tag}
          </span>
        )}

        {page.api && (
          <span className="shrink-0 text-[10px] font-bold font-mono uppercase text-gray-500">
            {page.api.split(" ")[0]}
          </span>
        )}

        {page.deprecated && (
          <span className="shrink-0 text-[10px] italic text-red-500">
            Deprecated
          </span>
        )}
      </a>
    </li>
  );
}

function SidebarGroupItem({
  group,
  currentPath,
}: {
  group: NavGroup;
  currentPath: string;
}) {
  return (
    <li className="mt-6 first:mt-0">
      <div className="px-4 pb-1.5 text-sm font-semibold leading-6 text-gray-900">
        {group.group}
      </div>
      <SidebarEntries entries={group.pages} currentPath={currentPath} />
    </li>
  );
}
