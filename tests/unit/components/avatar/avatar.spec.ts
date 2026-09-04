import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// chainsStore transitively loads the Ledger HW module (broken file in
// node_modules), which fails suite load. AvatarNetwork only needs getChainIcon,
// so stub the store to a minimal shape.
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ getChainIcon: () => undefined }),
}))

// blockies draws on a canvas — no 2d context in the test DOM. The account tests
// care about the ring/wiring, not the pattern bytes.
vi.mock('@/utils/blockies', () => ({
  default: () => ({ toDataURL: () => 'data:image/png;base64,stub' }),
}))

import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppAvatarCard from '@/components/avatar/AppAvatarCard.vue'
import AvatarStatusDot from '@/components/avatar/AvatarStatusDot.vue'
import AvatarInitial from '@/components/avatar/types/AvatarInitial.vue'
import AvatarIcon from '@/components/avatar/types/AvatarIcon.vue'
import {
  AVATAR_SIZES,
  badgeOffset,
  badgePositionStyle,
  statusBadgeBox,
  type AvatarSize,
} from '@/components/avatar/types'

const SIZES: AvatarSize[] = ['xs', 's', 'm', 'l', 'xl']

describe('avatar geometry (types.ts)', () => {
  it('badge overhangs by exactly badgeBox × 0.22 at every size', () => {
    for (const size of SIZES) {
      expect(badgeOffset(size)).toBeCloseTo(
        AVATAR_SIZES[size].badgeBox * 0.22,
        5,
      )
    }
  })

  it('matches the Figma M reference positions', () => {
    // box 32, badgeBox 18, offset 3.96 → far = 32 - 18 + 3.96 = 17.96
    expect(badgePositionStyle('m', 'top')).toMatchObject({
      top: '-3.96px',
      left: '17.96px',
      width: '18px',
      height: '18px',
    })
    expect(badgePositionStyle('m', 'bottom')).toMatchObject({
      top: '17.96px',
      left: '17.96px',
    })
    expect(badgePositionStyle('m', 'topLeft')).toMatchObject({
      top: '-3.96px',
      left: '-3.96px',
    })
    expect(badgePositionStyle('m', 'bottomLeft')).toMatchObject({
      top: '17.96px',
      left: '-3.96px',
    })
  })

  it('status badge is 8px at M', () => {
    expect(statusBadgeBox('m')).toBe(8)
  })
})

describe('AvatarStatusDot', () => {
  it.each([
    ['error', 'bg-error'],
    ['warning', 'bg-warning'],
    ['success', 'bg-success'],
    ['muted', 'bg-grey-subtle'],
  ] as const)('%s → %s', (type, cls) => {
    const wrapper = mount(AvatarStatusDot, { props: { type } })
    expect(wrapper.classes()).toContain(cls)
  })
})

describe('AppAvatarBadge', () => {
  it('network badge is white, filling the box', () => {
    const wrapper = mount(AppAvatarBadge, {
      props: { type: 'network', size: 'm' },
    })
    expect(wrapper.classes()).toContain('bg-white')
    expect(wrapper.classes()).toContain('w-full')
  })

  it('icon badge uses the icon-bg token', () => {
    const wrapper = mount(AppAvatarBadge, {
      props: { type: 'icon', size: 'm' },
    })
    expect(wrapper.classes()).toContain('bg-avatar-badge-icon-bg')
  })

  it('status badge renders a status dot', () => {
    const wrapper = mount(AppAvatarBadge, {
      props: { type: 'status', size: 'm', status: 'success' },
    })
    expect(wrapper.findComponent(AvatarStatusDot).exists()).toBe(true)
  })
})

describe('AppAvatarCard', () => {
  it.each([
    ['applePay', 'Apple Pay'],
    ['gPay', 'Google Pay'],
    ['masterCard', 'Mastercard'],
    ['paypal', 'PayPal'],
    ['pix', 'Pix'],
    ['visa', 'Visa'],
  ] as const)('%s renders its labelled mark', (method, label) => {
    const wrapper = mount(AppAvatarCard, { props: { method } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe(label)
  })
})

describe('AppAvatar', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('sizes the box from the size table', () => {
    for (const size of SIZES) {
      const wrapper = mount(AppAvatar, {
        props: { type: 'initial', size, initial: 'A' },
      })
      const el = wrapper.element as HTMLElement
      expect(el.style.width).toBe(`${AVATAR_SIZES[size].box}px`)
      expect(el.style.height).toBe(`${AVATAR_SIZES[size].box}px`)
    }
  })

  it('mounts the child that matches `type`', () => {
    const initial = mount(AppAvatar, {
      props: { type: 'initial', initial: 'A' },
    })
    expect(initial.findComponent(AvatarInitial).exists()).toBe(true)

    const icon = mount(AppAvatar, { props: { type: 'icon' } })
    expect(icon.findComponent(AvatarIcon).exists()).toBe(true)
  })

  it('paints the fallback bg for every type, except icon with background=false', () => {
    const withBg = mount(AppAvatar, {
      props: { type: 'initial', initial: 'A' },
    })
    expect(withBg.find('.bg-avatar-fallback').exists()).toBe(true)

    const iconNoBg = mount(AppAvatar, {
      props: { type: 'icon', background: false },
    })
    expect(iconNoBg.find('.bg-avatar-fallback').exists()).toBe(false)
  })

  it('positions a single badge slot at the requested corner', () => {
    const wrapper = mount(AppAvatar, {
      props: { type: 'initial', initial: 'A', badgeBottom: true },
      slots: { badge: '<i class="stub-badge" />' },
    })
    const badge = wrapper.find('.stub-badge')
    expect(badge.exists()).toBe(true)
    const style = badgePositionStyle('m', 'bottom')
    expect(wrapper.find('.absolute').attributes('style')).toContain(
      `top: ${style.top}`,
    )
  })

  it('draws the connected ring only for a connected account', () => {
    const connected = mount(AppAvatar, {
      props: { type: 'account', address: '0xabc', connected: true },
    })
    expect(connected.find('.border-success').exists()).toBe(true)

    const idle = mount(AppAvatar, {
      props: { type: 'account', address: '0xabc' },
    })
    expect(idle.find('.border-success').exists()).toBe(false)

    // The ring must live outside the clipping layer, or it gets clipped.
    const initial = mount(AppAvatar, {
      props: { type: 'initial', initial: 'A', connected: true },
    })
    expect(initial.find('.border-success').exists()).toBe(false)
  })

  it('warns in dev when more than one badge is active', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(AppAvatar, {
      props: {
        type: 'initial',
        initial: 'A',
        badgeTop: true,
        badgeBottom: true,
      },
    })
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })
})
