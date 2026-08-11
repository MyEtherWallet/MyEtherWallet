import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import TradeMarketTimeline from '@/modules/trade/components/TradeMarketTimeline.vue'

const mountTimeline = (props: Record<string, unknown> = {}) =>
  mount(TradeMarketTimeline, {
    props: {
      dayLabel: 'MON',
      markerPct: 50,
      timeLabel: '01:15 PM',
      ...props,
    },
    global: { plugins: [i18n] },
  })

describe('TradeMarketTimeline', () => {
  it('renders the day label, five segments and the time label', () => {
    const timeline = mountTimeline()
    expect(timeline.text()).toContain('MON')
    expect(timeline.findAll('.cursor-pointer')).toHaveLength(5)
    expect(timeline.text()).toContain('01:15 PM')
  })

  it('positions the marker from the percentage prop', () => {
    const marker = mountTimeline({ markerPct: 62.5 }).find('div[style*="left"]')
    expect(marker.attributes('style')).toContain('62.5%')
  })

  it('shows the session tooltip on hover and hides it on leave', async () => {
    const timeline = mountTimeline()
    const premarketSegment = timeline.findAll('.cursor-pointer')[1]

    await premarketSegment.trigger('mouseenter')
    expect(timeline.text()).toContain('Pre-market')
    expect(timeline.text()).toContain('04:00 AM → 09:31 AM')

    await premarketSegment.trigger('mouseleave')
    expect(timeline.text()).not.toContain('04:00 AM → 09:31 AM')
  })

  it('labels both caps as the overnight session', async () => {
    const timeline = mountTimeline()
    await timeline.findAll('.cursor-pointer')[4].trigger('mouseenter')
    expect(timeline.text()).toContain('Overnight')
  })

  it('renders custom session ranges when provided', async () => {
    const timeline = mountTimeline({
      sessionRanges: {
        premarket: '5:01 AM → 10:29 AM',
        regular: '10:31 AM → 4:59 PM',
        postmarket: '5:01 PM → 8:59 PM',
        overnight: '9:05 PM → 4:55 AM',
      },
    })
    await timeline.findAll('.cursor-pointer')[2].trigger('mouseenter')
    expect(timeline.text()).toContain('10:31 AM → 4:59 PM')
  })
})
