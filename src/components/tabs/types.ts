/**
 * TabItem design-library types (Figma: MEW Web App — Design Library ›
 * TabItem / _base, node 1072:611).
 */
export interface AppTabItemProps {
  label?: string
  selected?: boolean
  disabled?: boolean
}

/**
 * TabBar (Figma: TabBar, node 2175:7168). `alternative` sits on a white
 * surface, `default` on the grey one; only the bottom rule colour changes.
 */
export const TAB_BAR_SURFACES = ['alternative', 'default'] as const
export type TabBarSurface = (typeof TAB_BAR_SURFACES)[number]

export interface TabBarItem<TId extends string = string> {
  id: TId
  label: string
  disabled?: boolean
}
