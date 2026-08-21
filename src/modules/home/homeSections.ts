import { defineAsyncComponent, type Component } from 'vue'

export type HomeSectionVisibility = 'always' | 'connected' | 'unconnected'

export interface HomeSection {
  id: string
  component: Component
  visibleWhen: HomeSectionVisibility
  // Optional: headerless sections (e.g. the Hero) omit these and render no
  // title/subtitle header.
  titleKey?: string
  subtitleKey?: string
}

export const homeSections: HomeSection[] = [
  {
    // Placeholder until the Hero design (MEW-2094) is handed off. Headerless.
    id: 'hero',
    component: defineAsyncComponent(() => import('./sections/HomeHero.vue')),
    visibleWhen: 'always',
  },
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
  {
    id: 'news',
    component: defineAsyncComponent(
      () => import('./sections/HomeMarketNews.vue'),
    ),
    visibleWhen: 'always',
    titleKey: 'homePage.news.title',
    subtitleKey: 'homePage.news.subtitle',
  },
]
