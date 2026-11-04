import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// chainsStore pulls the Ledger HW module, which breaks suite load (see avatar.spec).
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ allChains: [] }),
}))

import AppAvatar from '@/components/avatar/AppAvatar.vue'
import { AVATAR_ICON_TONE_CLASS } from '@/components/avatar/types'

const inner = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('.rounded-full.overflow-hidden')

describe('AppAvatar — Icon type tone', () => {
  it('paints the status fill instead of the neutral fallback', () => {
    for (const [tone, fill] of Object.entries(AVATAR_ICON_TONE_CLASS)) {
      const wrapper = mount(AppAvatar, {
        props: { type: 'icon', size: 's', tone },
        slots: { icon: '<svg />' },
      })
      expect(inner(wrapper).classes()).toContain(fill)
      expect(inner(wrapper).classes()).not.toContain(
        'bg-background-info-subtle',
      )
    }
  })

  it('inverts the glyph colour only when toned', () => {
    const toned = mount(AppAvatar, {
      props: { type: 'icon', tone: 'success' },
      slots: { icon: '<svg />' },
    })
    expect(toned.find('.text-icon-inverted').exists()).toBe(true)

    const plain = mount(AppAvatar, {
      props: { type: 'icon' },
      slots: { icon: '<svg />' },
    })
    expect(plain.find('.text-icon-inverted').exists()).toBe(false)
    expect(plain.find('.text-text-default').exists()).toBe(true)
    expect(inner(plain).classes()).toContain('bg-background-info-subtle')
  })

  it('ignores the tone on other types', () => {
    const wrapper = mount(AppAvatar, {
      props: { type: 'initial', initial: 'A', tone: 'error' },
    })
    expect(inner(wrapper).classes()).not.toContain('bg-background-error')
    expect(inner(wrapper).classes()).toContain('bg-background-info-subtle')
  })
})
