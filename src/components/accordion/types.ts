import type { InjectionKey } from 'vue'

export type AccordionKey = string | number

/**
 * What AppAccordionGroup hands its accordions. The group owns which ones are
 * open, so an accordion inside a group ignores its own `open`. Each accordion
 * provides null to its own body, so a nested one isn't part of the group.
 */
export const ACCORDION_GROUP_KEY: InjectionKey<{
  isOpen: (key: AccordionKey) => boolean
  toggle: (key: AccordionKey) => void
} | null> = Symbol('AccordionGroup')
