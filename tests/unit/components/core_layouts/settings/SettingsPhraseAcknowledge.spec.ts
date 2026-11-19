import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})

import SettingsPhraseAcknowledge from '@/components/core_layouts/settings/SettingsPhraseAcknowledge.vue'

const render = () =>
  mount(SettingsPhraseAcknowledge, {
    global: { mocks: { $t: (key: string) => key } },
  })

describe('SettingsPhraseAcknowledge', () => {
  it('warns what the phrase gives access to and how to keep it', () => {
    const text = render().text()

    expect(text).toContain('settings.phrase.before_title')
    expect(text).toContain('settings.phrase.rule_share')
    expect(text).toContain('settings.phrase.rule_ask')
    expect(text).toContain('settings.phrase.rule_offline')
  })

  it('says the phrase opens on a separate page with a new login, before the user goes there', () => {
    expect(render().text()).toContain('settings.phrase.next_step')
  })

  it('asks to view the phrase from its button', async () => {
    const w = render()

    await w
      .findAll('button')
      .find(b => b.text().includes('settings.phrase.view'))!
      .trigger('click')

    expect(w.emitted('view')).toHaveLength(1)
  })

  it('goes back from its back arrow', async () => {
    const w = render()

    await w.get('button[aria-label="common.back"]').trigger('click')

    expect(w.emitted('back')).toHaveLength(1)
  })
})
