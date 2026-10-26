import { describe, it, expect } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import {
  useScrollEdges,
  type ScrollAxis,
} from '@/components/scroll_fade/useScrollEdges'

type Geometry = { offset: number; visibleSize: number; contentSize: number }

// jsdom has no layout, so the scroll geometry is stubbed on the element.
const stubGeometry = (
  element: HTMLElement,
  axis: ScrollAxis,
  { offset, visibleSize, contentSize }: Geometry,
) => {
  const [offsetKey, visibleKey, contentKey] =
    axis === 'x'
      ? ['scrollLeft', 'clientWidth', 'scrollWidth']
      : ['scrollTop', 'clientHeight', 'scrollHeight']
  Object.defineProperty(element, offsetKey, {
    value: offset,
    configurable: true,
  })
  Object.defineProperty(element, visibleKey, {
    value: visibleSize,
    configurable: true,
  })
  Object.defineProperty(element, contentKey, {
    value: contentSize,
    configurable: true,
  })
}

const mountWithEdges = (axis: ScrollAxis) => {
  let edges!: ReturnType<typeof useScrollEdges>
  const wrapper = mount(
    defineComponent({
      setup() {
        const scroller = ref<HTMLElement | null>(null)
        edges = useScrollEdges(scroller, axis)
        return () => h('div', { ref: scroller })
      },
    }),
  )
  return { element: wrapper.element as HTMLElement, edges }
}

describe('useScrollEdges', () => {
  it('reports no edges when the content fits', async () => {
    const { element, edges } = mountWithEdges('x')
    stubGeometry(element, 'x', {
      offset: 0,
      visibleSize: 300,
      contentSize: 300,
    })
    edges.update()
    await flushPromises()
    expect(edges.canScrollStart.value).toBe(false)
    expect(edges.canScrollEnd.value).toBe(false)
  })

  it('tracks start / middle / end on x, within the 1px tolerance', () => {
    const { element, edges } = mountWithEdges('x')
    const cases = [
      [0, false, true],
      [1, false, true],
      [200, true, true],
      [699, true, false],
      [700, true, false],
    ] as const
    for (const [offset, canScrollStart, canScrollEnd] of cases) {
      stubGeometry(element, 'x', {
        offset,
        visibleSize: 300,
        contentSize: 1000,
      })
      edges.update()
      expect(edges.canScrollStart.value).toBe(canScrollStart)
      expect(edges.canScrollEnd.value).toBe(canScrollEnd)
    }
  })

  it('reads the vertical geometry on y', () => {
    const { element, edges } = mountWithEdges('y')
    stubGeometry(element, 'y', {
      offset: 100,
      visibleSize: 200,
      contentSize: 600,
    })
    edges.update()
    expect(edges.canScrollStart.value).toBe(true)
    expect(edges.canScrollEnd.value).toBe(true)
  })

  it('updates on scroll', async () => {
    const { element, edges } = mountWithEdges('x')
    // The listener binds once the template ref resolves after mount.
    await flushPromises()
    stubGeometry(element, 'x', {
      offset: 0,
      visibleSize: 300,
      contentSize: 1000,
    })
    edges.update()
    expect(edges.canScrollStart.value).toBe(false)

    stubGeometry(element, 'x', {
      offset: 700,
      visibleSize: 300,
      contentSize: 1000,
    })
    element.dispatchEvent(new Event('scroll'))
    expect(edges.canScrollStart.value).toBe(true)
    expect(edges.canScrollEnd.value).toBe(false)
  })
})
