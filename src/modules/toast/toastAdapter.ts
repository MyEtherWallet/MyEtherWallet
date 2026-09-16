import {
  ToastType,
  type Toast,
  type ToastAsset,
  type ToastButton,
} from '@/types/notification'

export interface AppToastProps {
  type: ToastType
  title: string
  description: string
  button?: ToastButton
  asset?: ToastAsset
  duration: number
  isInfinite: boolean
}

export const mapToastToAppToast = (toast: Toast): AppToastProps => ({
  type: toast.type ?? ToastType.Info,
  title: toast.title ?? toast.text ?? '',
  description: toast.description ?? toast.textSecondary ?? '',
  button:
    toast.button ??
    (toast.link
      ? {
          label: toast.link.title,
          onClick: () =>
            window.open(toast.link?.url, '_blank', 'noopener,noreferrer'),
        }
      : undefined),
  asset: toast.asset,
  duration: toast.duration || 6000,
  isInfinite: toast.isInfinite ?? false,
})

export const hasLegacyToastContent = (toast: Toast): boolean =>
  Boolean(toast.hash || toast.tradeInfo)
