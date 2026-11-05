import moonpayIcon from '@/assets/images/buy/providers/moonpay.svg'
import simplexIcon from '@/assets/images/buy/providers/simplex.svg'
import topperIcon from '@/assets/images/buy/providers/topper.svg'
import coinbaseIcon from '@/assets/images/buy/providers/coinbase.svg'

/** Provider code (e.g. MOONPAY) as a display name (Moonpay). */
export const formatProviderName = (provider: string): string => {
  const name = provider.toLowerCase()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Brand marks cropped from the providers' wordmarks onto a white square, so an
// Avatar clips them round. Unknown providers fall back to initials.
const PROVIDER_ICONS: Record<string, string> = {
  MOONPAY: moonpayIcon,
  SIMPLEX: simplexIcon,
  TOPPER: topperIcon,
  COINBASE: coinbaseIcon,
}

export const getProviderIcon = (provider?: string): string | undefined =>
  provider ? PROVIDER_ICONS[provider] : undefined
