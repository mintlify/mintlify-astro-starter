import type { AnchorItem } from '../components/Sidebar/types';

interface DocsConfigAnchor {
  anchor: string;
  href: string;
  icon?: string;
  color?: string;
}

interface DocsConfig {
  navigation?: {
    global?: {
      anchors?: DocsConfigAnchor[];
    };
  };
}

export function getAnchorsFromConfig(config: DocsConfig): AnchorItem[] {
  const anchors = config.navigation?.global?.anchors || [];

  return anchors.map((anchor) => ({
    name: anchor.anchor,
    href: anchor.href,
    icon: anchor.icon,
    color: anchor.color,
  }));
}
