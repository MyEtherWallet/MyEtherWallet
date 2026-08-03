import { describe, it, expect } from 'vitest'
import en from '@/i18n/locales/home/en.json'
import es from '@/i18n/locales/home/es.json'
import zh from '@/i18n/locales/home/zh.json'

const REQUIRED = [
  'homePage.offers.title',
  'homePage.offers.subtitle',
  'homePage.listings.title',
  'homePage.listings.subtitle',
  'homePage.listings.tab.stocks',
  'homePage.listings.tab.crypto',
  'homePage.sectors.title',
  'homePage.sectors.subtitle',
  'homePage.news.title',
  'homePage.news.subtitle',
  'homePage.news.empty',
]
const flat = (o: any, p = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    typeof v === 'object' && v ? flat(v, `${p}${k}.`) : [`${p}${k}`]
  )

describe('home i18n', () => {
  it('en has all required keys', () => {
    const keys = flat(en)
    REQUIRED.forEach(k => expect(keys).toContain(k))
  })
  it('es and zh mirror en key set', () => {
    expect(flat(es).sort()).toEqual(flat(en).sort())
    expect(flat(zh).sort()).toEqual(flat(en).sort())
  })
  it('namespaces everything under a single homePage key (regression guard: home i18n keys must never sit at the top level, since common/en.json already owns a flat top-level "home" key used by t(\'home\') for nav labels)', () => {
    expect(Object.keys(en)).toEqual(['homePage'])
    expect(Object.keys(es)).toEqual(['homePage'])
    expect(Object.keys(zh)).toEqual(['homePage'])
  })
})
