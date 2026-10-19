import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { Chart } from 'chart.js'
import ChartPrice from '@/components/ChartPrice.vue'

vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (v: number) => ({ display: String(v) }),
    currencySymbol: ref('$'),
    rate: ref(1),
  }),
}))

/** jsdom has no 2D canvas: hand Chart.js a no-op context so it can render. */
const fakeContext = (canvas: HTMLCanvasElement) =>
  new Proxy({ canvas } as Record<PropertyKey, unknown>, {
    get: (t, p) =>
      p in t ? t[p] : () => ({ width: 0, addColorStop: () => undefined }),
    set: (t, p, v) => {
      t[p] = v
      return true
    },
  })

const nextFrame = () => new Promise(r => requestAnimationFrame(r))

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    function (this: HTMLCanvasElement) {
      return fakeContext(this) as unknown as CanvasRenderingContext2D
    } as HTMLCanvasElement['getContext'],
  )
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('ChartPrice', () => {
  // APP-MEW-WEB-1NE: teardown is deferred (destroy-delay), so after a route
  // change the chart is still alive while its canvas is out of the DOM.
  // Chart.js drops its dataset metas on detach but keeps the hovered tooltip
  // state, so a pointer event still queued for the next frame crashed with
  // "Cannot read properties of null (reading 'getParsed')".
  it('ignores a queued pointer event after its canvas leaves the DOM', async () => {
    const errors: unknown[] = []
    const onError = (e: ErrorEvent) => {
      errors.push(e.error)
      e.preventDefault()
    }
    window.addEventListener('error', onError)

    const wrapper = mount(ChartPrice, {
      attachTo: document.body,
      props: { labels: [1, 2, 3], points: [10, 12, 11], timeFrame: '1D' },
    })
    await flushPromises()
    const canvas = wrapper.get('canvas').element as HTMLCanvasElement
    const chart = Chart.getChart(canvas)!

    // User is hovering the chart, so the tooltip holds active elements.
    chart.tooltip!.setActiveElements([{ datasetIndex: 0, index: 1 }], {
      x: 0,
      y: 0,
    })
    // Pointer moves; Chart.js throttles handling to the next frame...
    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: 5 }))
    // ...and in that same frame the page navigates away.
    wrapper.unmount()
    await flushPromises()
    await nextFrame()

    window.removeEventListener('error', onError)
    expect(errors).toEqual([])
  })
})
