import { Anchor } from './Anchor';

export interface AnchorItem {
  name: string;
  href: string;
  icon?: string;
  color?: string;
}

interface AnchorsProps {
  anchors: AnchorItem[];
  primaryColor?: string;
}

export function Anchors({ anchors, primaryColor }: AnchorsProps) {
  if (anchors.length === 0) return null;

  return (
    <ul className="list-none mb-6">
      {anchors.map((anchor) => (
        <li key={anchor.href} className="list-none">
          <Anchor
            href={anchor.href}
            name={anchor.name}
            icon={anchor.icon}
            isActive={false}
            color={anchor.color ?? primaryColor}
          />
        </li>
      ))}
    </ul>
  );
}
