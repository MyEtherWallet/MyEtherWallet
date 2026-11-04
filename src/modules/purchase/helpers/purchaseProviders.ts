import visaLogo from '@/assets/images/buy/icon-visa.svg'
import mastercardLogo from '@/assets/images/buy/icon-master.svg'
import applePayLogo from '@/assets/images/buy/icon-apple-pay.svg'
import googlePayLogo from '@/assets/images/buy/icon-google-pay-logo.svg'
import pixLogo from '@/assets/images/buy/icon-pix-logo.svg'
import paypalLogo from '@/assets/images/buy/icon-paypal-logo.svg'
import venmoLogo from '@/assets/images/buy/icon-venmo-logo.svg'
import cashappLogo from '@/assets/images/buy/icon-cash-app-logo.png'
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

interface PaymentMethodIcon {
  src: string
  alt: string
}

const VISA: PaymentMethodIcon = { src: visaLogo, alt: 'Visa' }
const MASTERCARD: PaymentMethodIcon = { src: mastercardLogo, alt: 'Mastercard' }
const APPLE_PAY: PaymentMethodIcon = { src: applePayLogo, alt: 'Apple Pay' }
const GOOGLE_PAY: PaymentMethodIcon = { src: googlePayLogo, alt: 'Google Pay' }
const PIX: PaymentMethodIcon = { src: pixLogo, alt: 'Pix' }
const PAYPAL: PaymentMethodIcon = { src: paypalLogo, alt: 'PayPal' }
const VENMO: PaymentMethodIcon = { src: venmoLogo, alt: 'Venmo' }
const CASH_APP: PaymentMethodIcon = { src: cashappLogo, alt: 'Cash App' }

/**
 * The curated set of payment-method icons shown in the Buy module footer
 * ("we accept" banner). Order is driven by design, not by any specific quote.
 */
export const PAYMENT_METHOD_BANNER_ICONS: PaymentMethodIcon[] = [
  VISA,
  MASTERCARD,
  APPLE_PAY,
  GOOGLE_PAY,
  PIX,
  PAYPAL,
  VENMO,
  CASH_APP,
]
