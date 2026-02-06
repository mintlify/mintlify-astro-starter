import type { NavPage } from "../lib/navigation";

interface FooterProps {
  prev: NavPage | null;
  next: NavPage | null;
}

export default function Footer({ prev, next }: FooterProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 flex items-center justify-between">
      {prev ? (
        <a
          href={prev.href}
          className="group flex items-center gap-1.5 text-sm font-medium text-gray-500 no-underline! hover:text-gray-900 transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {prev.title}
        </a>
      ) : <span />}
      {next ? (
        <a
          href={next.href}
          className="group flex items-center gap-1.5 text-sm font-medium text-gray-500 no-underline! hover:text-gray-900 transition-colors duration-150"
        >
          {next.title}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </a>
      ) : <span />}
    </nav>
  );
}
