/**
 * Menu List roles (design library, Figma ↳ MenuList 873:4728). `listbox` for
 * option pickers, whose rows take `role="option"` + `aria-selected`; `menu`
 * for action menus, whose rows take `role="menuitem"`.
 */
export type MenuListRole = 'listbox' | 'menu'

/** Rows the keyboard moves between: a Cell keeps its own `role="button"` unless the consumer overrides it. */
export const MENU_LIST_ROW_SELECTOR =
  '[role="option"]:not([aria-disabled="true"]), [role="menuitem"]:not([aria-disabled="true"]), [role="button"]:not([aria-disabled="true"])'
