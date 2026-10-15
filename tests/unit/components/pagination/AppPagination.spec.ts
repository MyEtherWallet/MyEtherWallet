import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppPagination from '@/components/pagination/AppPagination.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import {
  PAGINATION_DIVIDER,
  type PaginationVariant,
} from '@/components/pagination/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: {
        pagination: 'Pagination',
        showing_page: 'Showing page {current} of {total}',
        previous_page: 'previous page',
        next_page: 'next page',
      },
    },
  },
})

const factory = (props: Record<string, unknown> = {}) =>
  mount(AppPagination, {
    props: { modelValue: 1, totalPages: 3, ...props },
    global: { plugins: [i18n] },
  })
const prev = (w: ReturnType<typeof factory>) =>
  w.get('button[aria-label="previous page"]')
const next = (w: ReturnType<typeof factory>) =>
  w.get('button[aria-label="next page"]')

describe('AppPagination', () => {
  it('renders a labelled nav with the page label', () => {
    const w = factory({ modelValue: 2 })
    expect(w.element.tagName).toBe('NAV')
    expect(w.attributes('aria-label')).toBe('Pagination')
    expect(w.get('[aria-live="polite"]').text()).toBe('Showing page 2 of 3')
  })

  // Figma "on default" (grey page) draws the strong rule, which AppDivider
  // calls `alternative`; the names are inverted between the two components.
  it.each<[PaginationVariant, string]>([
    ['default', 'alternative'],
    ['alternative', 'default'],
  ])('variant %s maps to divider %s', (variant, divider) => {
    expect(PAGINATION_DIVIDER[variant]).toBe(divider)
    expect(factory({ variant }).getComponent(AppDivider).props('variant')).toBe(
      divider,
    )
  })

  it('defaults to the grey-surface variant', () => {
    expect(factory().getComponent(AppDivider).props('variant')).toBe(
      'alternative',
    )
  })

  it('disables prev on the first page and next on the last', () => {
    const first = factory({ modelValue: 1 })
    expect(prev(first).attributes('disabled')).toBeDefined()
    expect(next(first).attributes('disabled')).toBeUndefined()

    const last = factory({ modelValue: 3 })
    expect(prev(last).attributes('disabled')).toBeUndefined()
    expect(next(last).attributes('disabled')).toBeDefined()
  })

  it('disables both buttons when there is a single page', () => {
    const w = factory({ totalPages: 1 })
    expect(prev(w).attributes('disabled')).toBeDefined()
    expect(next(w).attributes('disabled')).toBeDefined()
  })

  it('emits the next and previous page', async () => {
    const forward = factory({ modelValue: 2 })
    await next(forward).trigger('click')
    expect(forward.emitted('update:modelValue')).toEqual([[3]])

    const back = factory({ modelValue: 2 })
    await prev(back).trigger('click')
    expect(back.emitted('update:modelValue')).toEqual([[1]])
  })

  it('does not emit at the bounds', async () => {
    const first = factory({ modelValue: 1, totalPages: 1 })
    await prev(first).trigger('click')
    await next(first).trigger('click')
    expect(first.emitted('update:modelValue')).toBeUndefined()
  })

  it('clamps an out-of-range page back into range', async () => {
    const w = factory({ modelValue: 5, totalPages: 3 })
    await prev(w).trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[3]])
  })

  it('uses a custom label when provided', () => {
    const w = factory({
      modelValue: 2,
      label: (page: number, total: number) => `${page} / ${total}`,
    })
    expect(w.get('[aria-live="polite"]').text()).toBe('2 / 3')
  })
})
