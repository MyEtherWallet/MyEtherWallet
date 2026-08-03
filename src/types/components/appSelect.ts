export interface AppSelectOption {
  label: string
  value: string
  /**
   * When true and the select is in `useVueRouter` mode, this option renders as
   * an external `<a target="_blank">` (its `value` is the href) instead of a
   * router-link. Lets a single dropdown mix in-app routes with external links.
   */
  external?: boolean
}
