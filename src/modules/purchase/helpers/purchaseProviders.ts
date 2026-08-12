import moonpayLogo from '@/assets/images/buy/icon-moonpay.svg'
import simplexLogo from '@/assets/images/buy/icon-simplex.svg'
import topperLogo from '@/assets/images/buy/icon-topper.svg'
import coinbaseLogo from '@/assets/images/buy/icon-coinbase-light.svg'
import visaLogo from '@/assets/images/buy/icon-visa.svg'
import mastercardLogo from '@/assets/images/buy/icon-master.svg'
import applePayLogo from '@/assets/images/buy/icon-apple-pay.svg'
import googlePayLogo from '@/assets/images/buy/icon-google-pay-logo.svg'
import pixLogo from '@/assets/images/buy/icon-pix-logo.svg'
import paypalLogo from '@/assets/images/buy/icon-paypal-logo.svg'
import venmoLogo from '@/assets/images/buy/icon-paypal-logo.svg'
import bankLogo from '@/assets/images/buy/icon-bank.svg'
import i18n from '@/i18n'

const providerLogoMap: Record<string, string> = {
  MOONPAY: moonpayLogo,
  SIMPLEX: simplexLogo,
  TOPPER: topperLogo,
  COINBASE: coinbaseLogo,
  VENMO: venmoLogo
}

export const getProviderLogo = (provider: string): string | undefined =>
  providerLogoMap[provider]

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
// `alt` is resolved lazily inside `getPaymentMethodIcons` so it tracks the
// active locale on each render rather than freezing at module load.
const BANK: PaymentMethodIcon = { src: bankLogo, alt: 'Bank' }

/**
 * Maps a quote's list of accepted payment method codes (as returned by the
 * provider API) to a deduplicated, ordered list of icons to render.
 */
export const getPaymentMethodIcons = (
  methods: string[],
): PaymentMethodIcon[] => {
  const icons: PaymentMethodIcon[] = []
  const has = (code: string) => methods.includes(code)
  if (has('CREDIT_CARD') || has('DEBIT_CARD') || has('CARD')) {
    icons.push(VISA, MASTERCARD)
  }
  if (has('APPLE_PAY')) icons.push(APPLE_PAY)
  if (has('GOOGLE_PAY')) icons.push(GOOGLE_PAY)
  if (has('PIX')) icons.push(PIX)
  if (has('PAYPAL')) icons.push(PAYPAL)
  if (has('VENMO')) icons.push(VENMO)
  if (has('ACH') || has('ACH_BANK_ACCOUNT') || has('SEPA_OPEN_BANKING')) {
    icons.push({ ...BANK, alt: i18n.global.t('purchase.bank') })
  }
  return icons
}

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
  VENMO
]
