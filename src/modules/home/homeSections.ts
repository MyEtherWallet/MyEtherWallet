import type { Component } from 'vue'

export type HomeSectionVisibility = 'always' | 'connected' | 'unconnected'

export interface HomeSection {
  id: string
  component: Component
  visibleWhen: HomeSectionVisibility
  titleKey: string
  subtitleKey: string
}

// Sections are appended by their tasks. Hero (MEW-2094) will be the first entry when ready.
export const homeSections: HomeSection[] = []
