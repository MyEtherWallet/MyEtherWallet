import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

const track = vi.hoisted(() => vi.fn())
vi.mock('@/analytics', () => ({
  analytics: { trackAccountSecurityEvent: track },
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})

import SettingsPhraseAcknowledge from '@/components/core_layouts/settings/SettingsPhraseAcknowledge.vue'
import SettingsRecoveryPhrase from '@/components/core_layouts/settings/SettingsRecoveryPhrase.vue'

enableAutoUnmount(afterEach)

const mocks = { $t: (key: string) => key }
// None of these may also be an HTML attribute value ("false", "button"…):
// the tests look for the words anywhere in the rendered page.
const WORDS = [
  'worth',
  'weird',
  'dress',
  'seat',
  'any',
  'second',
  'fabric',
  'dinner',
  'celery',
  'whip',
  'demand',
  'settle',
]
const button = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll('button').find(b => b.text().includes(label))

describe('SettingsPhraseAcknowledge', () => {
  const render = (props = { loading: false, failed: false }) =>
    mount(SettingsPhraseAcknowledge, { props, global: { mocks } })

  it('warns what the phrase gives access to and lists the three rules before the button', () => {
    const w = render()

    expect(w.text()).toContain('settings.phrase.before_title')
    expect(w.text()).toContain('settings.phrase.warning')
    for (const rule of ['rule_share', 'rule_ask', 'rule_offline']) {
      expect(w.text()).toContain(`settings.phrase.${rule}`)
    }
  })

  it('asks for the phrase only when the user presses the button', async () => {
    const w = render()
    expect(w.emitted('view')).toBeUndefined()

    await button(w, 'settings.phrase.view')!.trigger('click')

    expect(w.emitted('view')).toHaveLength(1)
  })

  it('says so when the phrase could not be loaded, and can be pressed again', async () => {
    const w = render({ loading: false, failed: true })

    expect(w.find('[data-test="phrase-error"]').text()).toContain(
      'settings.phrase.error',
    )
    await button(w, 'settings.phrase.view')!.trigger('click')
    expect(w.emitted('view')).toHaveLength(1)
  })

  it('goes back from its back button', async () => {
    const w = render()

    await w.find('button[aria-label="common.back"]').trigger('click')

    expect(w.emitted('back')).toHaveLength(1)
  })
})

describe('SettingsRecoveryPhrase', () => {
  const writeText = vi.fn()
  const render = (words = WORDS) =>
    mount(SettingsRecoveryPhrase, { props: { words }, global: { mocks } })
  /** Every word that is anywhere in the rendered page, text or attribute. */
  const wordsInPage = (w: ReturnType<typeof render>, words = WORDS) =>
    words.filter(word => new RegExp(`\\b${word}\\b`).test(w.html()))

  beforeEach(() => {
    vi.clearAllMocks()
    writeText.mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
  })

  it('opens with every word hidden: none of them is in the page', () => {
    const w = render()

    expect(wordsInPage(w)).toEqual([])
    expect(button(w, 'settings.phrase.show')).toBeDefined()
  })

  it('shows the words numbered, column by column, once the user asks', async () => {
    const w = render()

    await button(w, 'settings.phrase.show')!.trigger('click')

    const shown = w.findAll('[data-test="phrase-word"]').map(el => el.text())
    expect(shown).toEqual(WORDS.map((word, index) => `${index + 1}${word}`))
    expect(track).toHaveBeenCalledWith('Recovery_Phrase_Revealed')
  })

  it('takes the words out of the page again on Hide', async () => {
    const w = render()
    await button(w, 'settings.phrase.show')!.trigger('click')

    await button(w, 'settings.phrase.hide')!.trigger('click')

    expect(wordsInPage(w)).toEqual([])
  })

  it('lays out however many words there are in two columns of equal length', async () => {
    const w = render()

    const grid = w.find('[data-test="phrase-grid"]')
    expect(grid.attributes('style')).toContain('repeat(6')

    const longer = [...WORDS, ...WORDS]
    expect(
      render(longer).find('[data-test="phrase-grid"]').attributes('style'),
    ).toContain('repeat(12')
  })

  it('copies the whole phrase, single spaces between words, even while hidden', async () => {
    const w = render()

    await button(w, 'settings.phrase.copy')!.trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(WORDS.join(' '))
    expect(button(w, 'settings.phrase.copied')).toBeDefined()
    expect(track).toHaveBeenCalledWith('Recovery_Phrase_Copied')
  })

  it('keeps every word out of attributes and inside the container session replay blocks', async () => {
    const w = render()
    await button(w, 'settings.phrase.show')!.trigger('click')

    const attributeValues = w
      .findAll('*')
      .flatMap(node => Object.values(node.attributes()))
      .join(' ')
    for (const word of WORDS) {
      expect(attributeValues).not.toMatch(new RegExp(`\\b${word}\\b`))
    }
    expect(
      w.find('[data-private]').findAll('[data-test="phrase-word"]'),
    ).toHaveLength(WORDS.length)
  })

  it('reports nothing about the phrase itself to analytics', async () => {
    const w = render()
    await button(w, 'settings.phrase.show')!.trigger('click')
    await button(w, 'settings.phrase.copy')!.trigger('click')
    await flushPromises()

    const sent = JSON.stringify(track.mock.calls)
    for (const word of WORDS) expect(sent).not.toContain(word)
    expect(sent).not.toContain(String(WORDS.length))
  })

  it('goes back from its back button', async () => {
    const w = render()

    await w.find('button[aria-label="common.back"]').trigger('click')

    expect(w.emitted('back')).toHaveLength(1)
  })
})
