import { describe, it, expect, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppCellWatchlistToggle from '@/components/AppCellWatchlistToggle.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: {
        add_to_watchlist: 'Add to Watchlist',
        remove_from_watchlist: 'Remove from Watchlist',
      },
    },
  },
})

const mountToggle = (props: Record<string, unknown> = {}) =>
  mount(AppCellWatchlistToggle, {
    props: { modelValue: false, ...props },
    global: { plugins: [i18n] },
  })

// Clickable parent row: spies on whatever bubbles out of the toggle.
const mountInRow = (onClick = vi.fn(), onKeydown = vi.fn()) =>
  mount(
    () =>
      h('div', { onClick, onKeydown }, [
        h(AppCellWatchlistToggle, { modelValue: false }),
      ]),
    { global: { plugins: [i18n] } },
  )

describe('AppCellWatchlistToggle — Cell watchlist star (MEW-2446)', () => {
  it('off: stroke star, icon/default, aria-pressed false, "add" label', () => {
    const w = mountToggle()
    const btn = w.get('button')
    expect(w.getComponent(AppIcon).props()).toMatchObject({
      name: 'star',
      variant: 'stroke',
      size: 'xxs',
    })
    expect(btn.classes()).toContain('text-icon-default')
    expect(btn.classes()).toContain('size-[22px]')
    expect(btn.attributes('aria-pressed')).toBe('false')
    expect(btn.attributes('aria-label')).toBe('Add to Watchlist')
  })

  it('on: filled star, icon/brand, aria-pressed true, "remove" label', () => {
    const w = mountToggle({ modelValue: true })
    const btn = w.get('button')
    expect(w.getComponent(AppIcon).props('variant')).toBe('filled')
    expect(btn.classes()).toContain('text-icon-brand')
    expect(btn.attributes('aria-pressed')).toBe('true')
    expect(btn.attributes('aria-label')).toBe('Remove from Watchlist')
  })

  it('is controlled: without a listener the star stays as passed', async () => {
    const w = mountToggle()
    await w.get('button').trigger('click')
    expect(w.getComponent(AppIcon).props('variant')).toBe('stroke')
  })

  it('click emits the flipped value', async () => {
    const off = mountToggle()
    await off.get('button').trigger('click')
    expect(off.emitted('update:modelValue')).toEqual([[true]])

    const on = mountToggle({ modelValue: true })
    await on.get('button').trigger('click')
    expect(on.emitted('update:modelValue')).toEqual([[false]])
  })

  it('click does not bubble to a clickable row', async () => {
    const onRowClick = vi.fn()
    const w = mountInRow(onRowClick)
    await w.get('button').trigger('click')
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it('Enter / Space keydown stays on the toggle', async () => {
    const onRowKeydown = vi.fn()
    const w = mountInRow(vi.fn(), onRowKeydown)
    await w.get('button').trigger('keydown', { key: 'Enter' })
    await w.get('button').trigger('keydown', { key: ' ' })
    expect(onRowKeydown).not.toHaveBeenCalled()
  })

  it('loading disables the button and never emits', async () => {
    const w = mountToggle({ loading: true })
    expect(w.get('button').attributes('disabled')).toBeDefined()
    await w.get('button').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
})
