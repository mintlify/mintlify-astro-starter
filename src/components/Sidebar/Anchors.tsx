import { Anchor } from './Anchor';
import type { AnchorItem } from './types';

interface AnchorsProps {
  anchors: AnchorItem[];
  primaryColor?: string;
}

export function Anchors({ anchors, primaryColor }: AnchorsProps) {
  return (
    <ul className="list-none mb-6">
      {anchors.map((anchor) => (
        <li key={anchor.href} className="list-none">
          <Anchor
            href={anchor.href}
            name={anchor.name}
            icon={anchor.icon}
            color={anchor.color ?? primaryColor}
          />
        </li>
      ))}
    </ul>
  );
}
