import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import TradeMarketStatusPopover from '@/modules/trade/components/TradeMarketStatusPopover.vue'
import TradeMarketTimeline from '@/modules/trade/components/TradeMarketTimeline.vue'

const mountPopover = (props: Record<string, unknown> = {}) =>
  mount(TradeMarketStatusPopover, {
    props: { status: 'regular', ...props },
    global: { plugins: [i18n] },
  })

describe('TradeMarketStatusPopover', () => {
  it.each([
    ['regular', 'The market is open.', 'All supported stocks are available.'],
    [
      'premarket',
      "The market hasn't opened yet.",
      'Only eligible stocks are available.',
    ],
    [
      'postmarket',
      'The market has closed.',
      'Only eligible stocks are available.',
    ],
    [
      'overnight',
      'The market has closed.',
      'Only eligible stocks are available.',
    ],
    ['paused', 'The market is paused.', 'Regular market is about to open.'],
  ])('describes the %s state', (status, title, body) => {
    const popover = mountPopover({ status })
    expect(popover.text()).toContain(title)
    expect(popover.text()).toContain(body)
    expect(popover.findComponent(TradeMarketTimeline).exists()).toBe(true)
  })

  it('describes the actual next session while paused when known', () => {
    const popover = mountPopover({
      status: 'paused',
      nextOpenText: 'Post-Market starts 5:01 PM',
    })
    expect(popover.text()).toContain('Post-Market starts 5:01 PM')
    expect(popover.text()).not.toContain('Regular market is about to open.')
  })

  it('replaces the timeline with the next opening on weekends', () => {
    const popover = mountPopover({
      status: 'weekend',
      nextOpenText: 'Pre-Market starts Monday 4:00 AM',
    })
    expect(popover.text()).toContain('The market is closed for the weekend.')
    expect(popover.text()).toContain('Pre-Market starts Monday 4:00 AM')
    expect(popover.findComponent(TradeMarketTimeline).exists()).toBe(false)
  })

  it('emits close from the close button', async () => {
    const popover = mountPopover()
    await popover.find('button[aria-label="close"]').trigger('click')
    expect(popover.emitted('close')).toHaveLength(1)
  })
})
