import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useFormPristine } from '@/composables/useFormPristine'

describe('useFormPristine', () => {
  it('marks the form dirty when a watched empty field receives a value', async () => {
    const amount = ref('')
    const address = ref('')
    const { isPristine } = useFormPristine([amount, address])

    amount.value = '1'
    await nextTick()

    expect(isPristine.value).toBe(false)
  })

  it('owns explicit reset and dirty transitions', async () => {
    const amount = ref('1')
    const { isPristine, reset, markDirty } = useFormPristine([amount])

    markDirty()
    expect(isPristine.value).toBe(false)

    reset()
    amount.value = '2'
    await nextTick()
    expect(isPristine.value).toBe(true)

    amount.value = ''
    await nextTick()
    amount.value = '3'
    await nextTick()
    expect(isPristine.value).toBe(false)
  })
})
