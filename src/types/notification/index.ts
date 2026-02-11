export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export interface ToastLink {
  title: string
  url: string
  isButton?: boolean
}

export interface Toast {
  type?: ToastType
  text: string
  textSecondary?: string
  link?: ToastLink
  duration?: number
  isInfinite?: boolean
  tradeInfo?: {
    fromToken: string
    fromtTokenIcon: string
    fromTokenIsStock: boolean
    fromAmount: string
    toToken: string
    toTokenIcon: string
    toTokenIsStock: boolean
    toAmount: string
  }
}
