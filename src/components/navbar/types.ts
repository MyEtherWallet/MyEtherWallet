/**
 * NavLink design-library classes (Figma: MEW Web App — Design Library ›
 * ↳ Navbar › NavLink, component set 575:3434). Box 32 tall: px 8 + label px 4,
 * py 6, radius 16, `label/sm`. The Navbar sits on white, so hover steps to
 * background/alternative-hover while Selected uses background/default-hover;
 * Selected keeps its fill on hover, as bound in Figma.
 */
export const NAV_LINK_CLASS = {
  base: 'inline-flex items-center justify-center rounded-16 px-2 py-1.5 text-label-sm text-text-default whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus',
  rest: 'hover:bg-background-alternative-hover',
  selected: 'bg-background-default-hover',
} as const
