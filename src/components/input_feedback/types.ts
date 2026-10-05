import type { IconName } from '@/components/icon/icons'

export const FEEDBACK_TYPES = ['error', 'success', 'warning', 'text'] as const
export type FeedbackType = (typeof FEEDBACK_TYPES)[number]

/** The `feedback` prop on AppInput / AppTextField. */
export type InputFeedback = { type: FeedbackType; message: string }

/** Fixed per type (Figma `_feedback / _base`); `text` has no icon. */
export const FEEDBACK_ICON: Record<Exclude<FeedbackType, 'text'>, IconName> = {
  error: 'exclamation-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
}

/** Text + icon colour; the icon inherits it via currentColor. */
export const FEEDBACK_CLASS: Record<FeedbackType, string> = {
  error: 'text-text-error',
  success: 'text-text-success',
  warning: 'text-text-warning',
  text: 'text-text-subtle',
}
