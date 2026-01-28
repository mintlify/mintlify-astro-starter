export interface DecoratedPage {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  sidebarTitle?: string;
  deprecated?: boolean;
  lastUpdatedDate?: string;
  createdDate?: string;
}

export interface DecoratedGroup {
  group: string;
  pages: (DecoratedPage | DecoratedGroup)[];
  icon?: string;
  root?: DecoratedPage;
}

export interface DecoratedNavigationConfig {
  groups?: DecoratedGroup[];
  tabs?: DecoratedNavigationConfig[];
  versions?: DecoratedNavigationConfig[];
  products?: DecoratedNavigationConfig[];
  languages?: DecoratedNavigationConfig[];
  dropdowns?: DecoratedNavigationConfig[];
  anchors?: DecoratedNavigationConfig[];
  pages?: (DecoratedPage | DecoratedGroup)[];
  global?: unknown;
}

export interface NavigationResponse {
  docsDecoratedNav: DecoratedNavigationConfig;
  favicons: Favicons;
}

export interface MdxPageResponse {
  content: string;
  metadata?: {
    title?: string;
    description?: string;
    icon?: string;
    href?: string;
  };
}

export interface FaviconIcon {
  rel: string;
  sizes?: string;
  type: string;
  href: string;
  media?: string;
}

export interface Favicons {
  icons: FaviconIcon[];
  browserconfig?: string;
}
