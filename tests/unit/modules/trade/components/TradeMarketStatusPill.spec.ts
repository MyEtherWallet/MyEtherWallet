import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import TradeMarketStatusPill from '@/modules/trade/components/TradeMarketStatusPill.vue'
import TradeMarketStatusPopover from '@/modules/trade/components/TradeMarketStatusPopover.vue'

const mountPill = (props: Record<string, unknown> = {}) =>
  mount(TradeMarketStatusPill, {
    props: { status: 'regular', untilText: 'Until 3:59 PM', ...props },
    global: { plugins: [i18n] },
  })

describe('TradeMarketStatusPill', () => {
  it('renders the open state in green without the limited note', () => {
    const pill = mountPill()
    expect(pill.text()).toContain('Regular market')
    expect(pill.find('p').classes()).toContain('text-success-600')
    expect(pill.text()).not.toContain('Market limited')
  })

  it.each(['premarket', 'postmarket', 'overnight', 'weekend'])(
    'renders %s in orange with the limited note',
    status => {
      const pill = mountPill({ status })
      expect(pill.find('p').classes()).toContain('text-orange-600')
      expect(pill.text()).toContain('Market limited')
    },
  )

  it('renders paused in the subtle color without the limited note', () => {
    const pill = mountPill({ status: 'paused' })
    expect(pill.text()).toContain('Market paused')
    expect(pill.find('p').classes()).toContain('text-info')
    expect(pill.text()).not.toContain('Market limited')
  })

  it('shows the until text on the right', () => {
    expect(mountPill({ untilText: 'Until 8:59 PM' }).text()).toContain(
      'Until 8:59 PM',
    )
  })

  it('toggles the info popover from the info button', async () => {
    const pill = mountPill()
    expect(pill.findComponent(TradeMarketStatusPopover).exists()).toBe(false)

    await pill.find('button').trigger('click')
    expect(pill.findComponent(TradeMarketStatusPopover).exists()).toBe(true)

    await pill.find('button').trigger('click')
    expect(pill.findComponent(TradeMarketStatusPopover).exists()).toBe(false)
  })
})
