import { describe, it, expect } from 'vitest'
import en from '@/i18n/locales/home/en.json'
import es from '@/i18n/locales/home/es.json'
import zh from '@/i18n/locales/home/zh.json'

const REQUIRED = [
  'offers.title',
  'offers.subtitle',
  'listings.title',
  'listings.subtitle',
  'listings.tab.stocks',
  'listings.tab.crypto',
  'sectors.title',
  'sectors.subtitle',
  'news.title',
  'news.subtitle',
  'news.empty',
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
})
