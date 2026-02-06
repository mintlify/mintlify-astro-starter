import type { TabInfo } from "../lib/navigation";
import { cn } from "../lib/cn";

interface HeaderProps {
  logo?: string;
  name?: string;
  tabs: TabInfo[] | null;
  primaryColor?: string;
}

export default function Header({ logo, name, tabs, primaryColor }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="h-16 border-b border-gray-200/60">
        <div className="h-full flex items-center w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <img src={logo} alt={name} />
          </a>
        </div>
      </nav>

      {tabs && tabs.length > 0 && (
        <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-100">
          <div className="flex gap-5">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={cn(
                  "relative py-3 text-sm leading-5 no-underline whitespace-nowrap border-b-2 -mb-px transition-colors duration-150",
                  tab.isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400 font-medium border-transparent hover:text-gray-500"
                )}
                style={tab.isActive ? { borderBottomColor: primaryColor } : undefined}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
