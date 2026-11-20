import { describe, it, expect, afterEach } from 'vitest'
import { computed, effectScope, nextTick, ref, type EffectScope } from 'vue'
import { useOipPairGuard } from '@/modules/trade/composables/useOipPairGuard'
import type { NewTokenInfo } from '@/stores/swapStore'

const token = (symbol: string) => ({ symbol }) as NewTokenInfo

let scope: EffectScope | undefined

const setup = (defaultTo: NewTokenInfo | null = token('USDT')) => {
  const allowed = ref(true)
  const toTokenSelected = ref<NewTokenInfo | null>(token('BIG5ON'))
  const toTokenManuallySelected = ref(true)
  scope = effectScope()
  const guard = scope.run(() =>
    useOipPairGuard({
      form: { toTokenSelected, toTokenManuallySelected },
      isOipPairAllowed: computed(() => allowed.value),
      getDefaultToToken: () => defaultTo,
    }),
  )!
  return { ...guard, allowed, toTokenSelected, toTokenManuallySelected }
}

describe('useOipPairGuard', () => {
  afterEach(() => {
    scope?.stop()
    scope = undefined
  })

  it('leaves an allowed pair alone', () => {
    const { ensureValidPair, toTokenSelected, toTokenManuallySelected } =
      setup()

    expect(ensureValidPair()).toBe(false)
    expect(toTokenSelected.value?.symbol).toBe('BIG5ON')
    expect(toTokenManuallySelected.value).toBe(true)
  })

  it('resets To to the default, synchronously, when the pair is refused', () => {
    const {
      ensureValidPair,
      allowed,
      toTokenSelected,
      toTokenManuallySelected,
    } = setup()
    allowed.value = false

    expect(ensureValidPair()).toBe(true)
    expect(toTokenSelected.value?.symbol).toBe('USDT')
    expect(toTokenManuallySelected.value).toBe(false)
  })

  it('resets To on its own when the pair turns refused without a user pick', async () => {
    const { allowed, toTokenSelected, toTokenManuallySelected } = setup()

    allowed.value = false
    await nextTick()

    expect(toTokenSelected.value?.symbol).toBe('USDT')
    expect(toTokenManuallySelected.value).toBe(false)
  })

  it('does not touch To when the pair turns allowed again', async () => {
    const { allowed, toTokenSelected } = setup()
    allowed.value = false
    await nextTick()

    toTokenSelected.value = token('USDC')
    allowed.value = true
    await nextTick()

    expect(toTokenSelected.value?.symbol).toBe('USDC')
  })

  it('clears To when the new list has no token to fall back to', () => {
    const { ensureValidPair, allowed, toTokenSelected } = setup(null)
    allowed.value = false

    expect(ensureValidPair()).toBe(true)
    expect(toTokenSelected.value).toBeNull()
  })
})
