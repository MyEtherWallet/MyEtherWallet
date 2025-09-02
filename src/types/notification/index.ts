export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export interface ToastLink {
  title: string
  url: string
}

export interface Toast {
  type?: ToastType
  text: string
  link?: ToastLink
  duration?: number
  isInfinite?: boolean
}
