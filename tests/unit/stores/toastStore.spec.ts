import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '@/stores/toastStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('toastStore', () => {
  it('gives every toast a unique id', () => {
    const store = useToastStore()
    store.addToastMessage({ text: 'a' })
    store.addToastMessage({ text: 'a' })
    const [first, second] = store.messages
    expect(first.id).toBeTruthy()
    expect(second.id).toBeTruthy()
    expect(first.id).not.toBe(second.id)
  })

  it('keeps a caller id and replaces a toast re-added with the same id', () => {
    const store = useToastStore()
    store.addToastMessage({ id: 'trade-1', text: 'Processing' })
    store.addToastMessage({ text: 'Other' })
    store.addToastMessage({ id: 'trade-1', text: 'Completed' })
    expect(store.messages.map(({ text }) => text)).toEqual([
      'Completed',
      'Other',
    ])
  })

  it('removes by id', () => {
    const store = useToastStore()
    store.addToastMessage({ id: 'x', text: 'a' })
    store.addToastMessage({ text: 'b' })
    store.removeToastById('x')
    expect(store.messages.map(({ text }) => text)).toEqual(['b'])
  })
})
