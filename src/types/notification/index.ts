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
  id?: string
  type?: ToastType
  text: string
  textSecondary?: string
  link?: ToastLink
  duration?: number
  isInfinite?: boolean
  tradeStatus?: {
    kind: 'processing' | 'completed'
    toTokenIcon?: string
    toSymbol?: string
    toTokenIsStock?: boolean
  }
}
