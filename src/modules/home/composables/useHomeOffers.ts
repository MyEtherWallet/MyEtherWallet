import { shallowRef, type Ref, type Component } from 'vue'
import { ChartBarSquareIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid'
import type { WalletPanel } from '@/stores/walletMenuStore'

export interface HomeOffer {
  id: string
  categoryKey: string
  icon: Component
  titleKey: string
  highlightKey: string
  gradient: 'purple' | 'blue' | 'green'
  // Side-drawer panel this offer opens (not a route — opens a module).
  panel: WalletPanel
}

// ponytail: static placeholder — swap this body for a CMS fetch when the endpoint exists.
export function useHomeOffers(): {
  offers: Ref<HomeOffer[]>
  isLoading: Ref<boolean>
} {
  // shallowRef: the icon Components must not be made deeply reactive.
  const offers = shallowRef<HomeOffer[]>([
    {
      id: 'trade',
      categoryKey: 'homePage.offers.category.trade',
      icon: ChartBarSquareIcon,
      titleKey: 'homePage.offers.items.trade.title',
      highlightKey: 'homePage.offers.items.trade.highlight',
      gradient: 'purple',
      panel: 'trade',
    },
    {
      id: 'buy',
      categoryKey: 'homePage.offers.category.buy',
      icon: CurrencyDollarIcon,
      titleKey: 'homePage.offers.items.buy.title',
      highlightKey: 'homePage.offers.items.buy.highlight',
      gradient: 'blue',
      panel: 'purchase',
    },
    {
      id: 'hold',
      categoryKey: 'homePage.offers.category.trade',
      icon: ChartBarSquareIcon,
      titleKey: 'homePage.offers.items.hold.title',
      highlightKey: 'homePage.offers.items.hold.highlight',
      gradient: 'green',
      panel: 'trade',
    },
  ])
  return { offers, isLoading: shallowRef(false) }
}
