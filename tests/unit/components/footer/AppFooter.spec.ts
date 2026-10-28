import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { AppFooter, FOOTER_EVENTS } from '@myetherwallet/vue-common-components'
import enFooter from '@/i18n/locales/footer/en.json'
import esFooter from '@/i18n/locales/footer/es.json'
import zhFooter from '@/i18n/locales/footer/zh.json'
import { useFooterProps } from '@/composables/useFooterProps'
import configs from '@/configs'

const i18n = () =>
  createI18n({ legacy: false, locale: 'en', messages: { en: enFooter } })

const getProps = () => {
  let props!: ReturnType<typeof useFooterProps>['value']
  mount(
    defineComponent({
      setup() {
        props = useFooterProps().value
        return () => h('div')
      },
    }),
    { global: { plugins: [i18n()] } },
  )
  return props
}

const mountFooter = (track = vi.fn()) =>
  mount(AppFooter, {
    props: { ...getProps(), amplitude: { track } },
  })

describe('useFooterProps (MEW-2443)', () => {
  it('builds the three Figma link groups — no Rewards link', () => {
    const { linkGroups } = getProps()
    expect(linkGroups.map(g => g.links.length)).toEqual([6, 3, 5])
    const labels = linkGroups.flatMap(g => g.links.map(l => l.label))
    expect(labels).not.toContain('Rewards')
    expect(labels).toContain('Press Kit')
  })

  it('keeps an Amplitude event on every link, donation and social', () => {
    const p = getProps()
    for (const l of p.linkGroups.flatMap(g => g.links))
      expect(l.event).toBeTruthy()
    for (const d of p.donations) expect(d.event).toBeTruthy()
    expect(p.socials.map(s => s.name)).toEqual([
      'twitter',
      'instagram',
      'linkedin',
      'github',
      'reddit',
      'youtube',
      'telegram',
    ])
    for (const s of p.socials) {
      expect(s.event).toBe(FOOTER_EVENTS.joinCommunity)
      expect(s.eventItem).toBe(s.name)
    }
  })

  it('stamps the current year and links the version to its release tag', () => {
    const p = getProps()
    expect(p.copyright).toContain(String(new Date().getFullYear()))
    expect(p.version).toBe(`v${configs.APP_VERSION}`)
    expect(p.releaseUrl).toBe(
      `https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${configs.APP_VERSION}`,
    )
  })

  it('has the same footer keys in en, es and zh', () => {
    const keys = (o: { footer: object }) => Object.keys(o.footer).sort()
    expect(keys(esFooter)).toEqual(keys(enFooter))
    expect(keys(zhFooter)).toEqual(keys(enFooter))
  })
})

describe('AppFooter with the app props', () => {
  it('renders a footer landmark with three labelled navs', () => {
    const w = mountFooter()
    expect(w.find('footer').exists()).toBe(true)
    const navs = w.findAll('nav')
    expect(navs.map(n => n.attributes('aria-label'))).toEqual([
      'Company',
      'Products',
      'Support',
    ])
  })

  it('opens external links in a new tab safely and keeps site links in place', () => {
    const w = mountFooter()
    for (const a of w.findAll('a[target="_blank"]'))
      expect(a.attributes('rel')).toBe('noopener noreferrer')
    const about = w.findAll('a').find(a => a.text() === 'About us')!
    expect(about.attributes('href')).toBe('https://www.myetherwallet.com/about')
    expect(about.attributes('target')).toBeUndefined()
  })

  it('draws the token avatar on each donation chip', () => {
    const w = mountFooter()
    const chips = ['Ethereum donation', 'Bitcoin donation'].map(
      label => w.findAll('a').find(a => a.text() === label)!,
    )
    for (const chip of chips) {
      const avatar = chip.get('img')
      expect(avatar.attributes('src')).toBeTruthy()
      expect(avatar.attributes('alt')).toBe('')
    }
  })

  it('renders the seven socials with accessible names', () => {
    const w = mountFooter()
    const socials = w.findAll('a[aria-label^="MEW "]')
    expect(socials).toHaveLength(7)
  })

  it('tracks link and social clicks with the 1.x events', async () => {
    const track = vi.fn()
    const w = mountFooter(track)
    await w
      .findAll('a')
      .find(a => a.text() === 'Team')!
      .trigger('click')
    expect(track).toHaveBeenCalledWith(FOOTER_EVENTS.team, {
      route: undefined,
      item: undefined,
    })
    await w.get('a[aria-label="MEW Reddit"]').trigger('click')
    expect(track).toHaveBeenLastCalledWith(FOOTER_EVENTS.joinCommunity, {
      route: undefined,
      item: 'reddit',
    })
  })

  it('switches layout on its own width (688 / 1360 container queries)', () => {
    const w = mountFooter()
    expect(w.get('footer').classes()).toContain('@container')
    const html = w.html()
    expect(html).toContain('@[688px]:grid-cols-2')
    expect(html).toContain('@[1360px]:grid-cols-4')
  })
})
