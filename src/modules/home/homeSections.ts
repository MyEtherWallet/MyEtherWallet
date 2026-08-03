import { defineAsyncComponent, type Component } from 'vue'

export type HomeSectionVisibility = 'always' | 'connected' | 'unconnected'

export interface HomeSection {
  id: string
  component: Component
  visibleWhen: HomeSectionVisibility
  titleKey: string
  subtitleKey: string
}

// Sections are appended by their tasks. Hero (MEW-2094) will be the first entry when ready.
export const homeSections: HomeSection[] = [
  {
    id: 'offers',
    component: defineAsyncComponent(() => import('./sections/HomeOffers.vue')),
    visibleWhen: 'always',
    titleKey: 'homePage.offers.title',
    subtitleKey: 'homePage.offers.subtitle',
  },
  {
    id: 'listings',
    component: defineAsyncComponent(
      () => import('./sections/HomeNewListings.vue'),
    ),
    visibleWhen: 'always',
    titleKey: 'homePage.listings.title',
    subtitleKey: 'homePage.listings.subtitle',
  },
  {
    id: 'sectors',
    component: defineAsyncComponent(
      () => import('./sections/HomeIndustrySectors.vue'),
    ),
    visibleWhen: 'always',
    titleKey: 'homePage.sectors.title',
    subtitleKey: 'homePage.sectors.subtitle',
  },
]
