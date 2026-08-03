import { ref, type Ref } from 'vue'

export interface HomeOffer {
  id: string
  titleKey: string
  descriptionKey: string
  icon?: string
  to?: string
}

// ponytail: static placeholder — swap this body for a CMS fetch when the endpoint exists.
export function useHomeOffers(): {
  offers: Ref<HomeOffer[]>
  isLoading: Ref<boolean>
} {
  const offers = ref<HomeOffer[]>([
    {
      id: 'buy',
      titleKey: 'homePage.offers.items.buy.title',
      descriptionKey: 'homePage.offers.items.buy.desc',
      to: '/stocks',
    },
    {
      id: 'swap',
      titleKey: 'homePage.offers.items.swap.title',
      descriptionKey: 'homePage.offers.items.swap.desc',
      to: '/',
    },
    {
      id: 'earn',
      titleKey: 'homePage.offers.items.earn.title',
      descriptionKey: 'homePage.offers.items.earn.desc',
      to: '/earn',
    },
  ])
  return { offers, isLoading: ref(false) }
}
