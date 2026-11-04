import { ToastType as StoreToastType, type Toast } from '@/types/notification'
import type { ToastAsset, ToastType } from '@/components/toast/types'

export const DEFAULT_TOAST_DURATION = 6000

const STORE_TYPE_TO_TOAST_TYPE: Record<StoreToastType, ToastType> = {
  [StoreToastType.Success]: 'success',
  [StoreToastType.Error]: 'error',
  [StoreToastType.Warning]: 'warning',
  [StoreToastType.Info]: 'info',
}

/**
 * Toasts the design-library Toast has no slot for (a raw copied value, the
 * swap/bridge from → to summary) keep the legacy layout.
 */
export const isLegacyToast = (toast: Toast) =>
  Boolean(toast.hash || toast.tradeInfo)

export const toastTypeOf = (toast: Toast): ToastType => {
  if (toast.tradeStatus) {
    return toast.tradeStatus.kind === 'processing'
      ? 'processing'
      : 'transaction-completed'
  }
  return STORE_TYPE_TO_TOAST_TYPE[toast.type ?? StoreToastType.Info]
}

export const toastAssetOf = (toast: Toast): ToastAsset | undefined =>
  toast.tradeStatus?.kind === 'completed'
    ? {
        url: toast.tradeStatus.toTokenIcon,
        symbol: toast.tradeStatus.toSymbol,
        isStock: toast.tradeStatus.toTokenIsStock,
      }
    : undefined

/** Milliseconds until auto-dismiss, or null to stay until removed. */
export const toastDurationOf = (toast: Toast): number | null => {
  // A processing toast stays until its flow resolves or removes it.
  if (toastTypeOf(toast) === 'processing' || toast.isInfinite) return null
  return toast.duration || DEFAULT_TOAST_DURATION
}
