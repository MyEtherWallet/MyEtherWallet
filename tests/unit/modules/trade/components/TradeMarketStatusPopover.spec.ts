import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import TradeMarketStatusPopover from '@/modules/trade/components/TradeMarketStatusPopover.vue'
import TradeMarketTimeline from '@/modules/trade/components/TradeMarketTimeline.vue'

const mountPopover = (props: Record<string, unknown> = {}) =>
  mount(TradeMarketStatusPopover, {
    props: { status: 'regular', ...props },
    global: { plugins: [i18n] },
  })

const rect = (left: number, width: number) =>
  ({ left, right: left + width, width }) as DOMRect

// The popover root sits centred under the info icon; `boundary` is the pill.
const mountInBoundary = async (popoverLeft: number) => {
  const boundary = document.createElement('div')
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: Element) {
      return this === boundary ? rect(100, 340) : rect(popoverLeft, 260)
    },
  )
  const popover = mountPopover({ boundary })
  await nextTick()
  return popover.get('svg + div')
}

describe('TradeMarketStatusPopover', () => {
  afterEach(() => vi.restoreAllMocks())

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

  it.each([
    ['right past the left edge', 44, 56],
    ['left past the right edge', 300, -120],
    ['nowhere when it fits', 150, 0],
  ])('slides the card %s', async (_, popoverLeft, shift) => {
    expect((await mountInBoundary(popoverLeft)).attributes('style')).toContain(
      `translateX(${shift}px)`,
    )
  })
})
