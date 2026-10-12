import type { IconName } from '@/components/icon/icons'

/** One ActionBar button. `label` arrives already translated by the caller. */
export interface ActionBarItem<TId extends string = string> {
  id: TId
  icon: IconName
  label: string
  disabled?: boolean
}
