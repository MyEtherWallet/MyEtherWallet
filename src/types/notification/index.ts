export enum ToastType {
  Processing = 'processing',
  TransactionCompleted = 'transaction-completed',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export interface ToastButton {
  label: string
  onClick: () => void
}

export interface ToastAsset {
  url?: string | null
  symbol?: string
  isStock?: boolean
}

export interface ToastLink {
  title: string
  url: string
  isButton?: boolean
}

export interface Toast {
  id?: string
  variant?: 'default' | 'dark'
  type?: ToastType
  title?: string
  description?: string
  button?: ToastButton
  asset?: ToastAsset
  text?: string
  textSecondary?: string
  hash?: string
  link?: ToastLink
  duration?: number
  isInfinite?: boolean
  tradeStatus?: {
    kind: 'processing' | 'completed'
    toTokenIcon?: string
    toSymbol?: string
    toTokenIsStock?: boolean
  }
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
