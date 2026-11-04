import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIconContainer from '@/components/icon_container/AppIconContainer.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

describe('AppIconContainer', () => {
  it('is a 32px circle holding a 24px filled glyph', () => {
    const w = mount(AppIconContainer, {
      props: { icon: 'check-circle', tone: 'success' },
    })
    expect(w.classes()).toEqual(
      expect.arrayContaining(['size-8', 'rounded-full', 'shrink-0']),
    )
    const icon = w.getComponent(AppIcon)
    expect(icon.props()).toMatchObject({
      name: 'check-circle',
      variant: 'filled',
      size: 'm',
    })
  })

  it.each([
    ['info', 'bg-background-alternative', 'text-icon-default'],
    ['error', 'bg-background-error-subtle', 'text-background-error'],
    ['success', 'bg-background-success-subtle', 'text-background-success'],
    ['warning', 'bg-background-warning-subtle', 'text-background-warning'],
  ] as const)('%s tone → %s circle, %s glyph', (tone, bg, glyph) => {
    const w = mount(AppIconContainer, {
      props: { icon: 'information-circle', tone },
    })
    expect(w.classes()).toEqual(expect.arrayContaining([bg, glyph]))
  })
})
