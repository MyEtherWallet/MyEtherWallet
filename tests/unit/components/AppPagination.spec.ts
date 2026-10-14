import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPagination from '@/components/AppPagination.vue'

describe('AppPagination', () => {
  const factory = (page = 1) =>
    mount(AppPagination, { props: { modelValue: page, total: 25, perPage: 10 } }) // 3 pages

  it('disables prev on first page', () => {
    expect(factory(1).get('[data-test="prev"]').attributes('disabled')).toBeDefined()
  })
  it('disables next on last page', () => {
    expect(factory(3).get('[data-test="next"]').attributes('disabled')).toBeDefined()
  })
  it('emits update:modelValue with next page', async () => {
    const w = factory(1)
    await w.get('[data-test="next"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([2])
  })
})
