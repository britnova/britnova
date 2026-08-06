/*
 * Homepage nav links — the four in-page anchors shared by SiteHeader (desktop
 * nav + mobile disclosure) and SiteFooter. Single source so the two never
 * drift out of sync.
 */

export interface NavLink {
  href: string;
  label: string;
}

export const homeNav: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#stack', label: 'Stack' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];
