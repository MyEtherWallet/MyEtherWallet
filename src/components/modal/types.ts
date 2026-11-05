/**
 * One footer action of AppModal. The slot it fills sets its button type
 * (tertiary / secondary / primary, left to right); `tone` adds danger or
 * success on top.
 */
export interface ModalButton {
  label: string
  onClick: () => void
  tone?: 'default' | 'danger' | 'success'
  loading?: boolean
  disabled?: boolean
}

export interface ModalButtons {
  primary: ModalButton
  secondary?: ModalButton
  tertiary?: ModalButton
}
