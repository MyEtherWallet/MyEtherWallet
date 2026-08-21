import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, nextTick, effectScope, type EffectScope } from 'vue'
import { useQuoteCountdown } from '@/modules/purchase/composables/useQuoteCountdown'

const BASE_TIME = 1_700_000_000_000

describe('useQuoteCountdown', () => {
  let scope: EffectScope
  const expiresAt = ref<number | null>(null)
  const rateLimitedUntil = ref<number | null>(null)
  const enabled = ref(true)
  const onExpire = vi.fn()

  const mount = () => {
    let result!: ReturnType<typeof useQuoteCountdown>
    scope = effectScope()
    scope.run(() => {
      result = useQuoteCountdown({
        expiresAt,
        rateLimitedUntil,
        enabled,
        onExpire,
      })
    })
    return result
  }

  beforeEach(() => {
    vi.useFakeTimers({ now: BASE_TIME })
    expiresAt.value = null
    rateLimitedUntil.value = null
    enabled.value = true
    onExpire.mockClear()
  })

  afterEach(() => {
    scope?.stop()
    vi.useRealTimers()
  })

  it('counts down and calls onExpire once when the quote expires', async () => {
    const countdown = mount()
    expiresAt.value = Date.now() + 30_000
    await nextTick()

    expect(countdown.secondsLeft.value).toBe(30)
    expect(countdown.isExpired.value).toBe(false)

    await vi.advanceTimersByTimeAsync(10_000)
    expect(countdown.secondsLeft.value).toBe(20)
    expect(onExpire).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(20_000)
    await nextTick()
    expect(countdown.isExpired.value).toBe(true)
    expect(countdown.secondsLeft.value).toBe(0)
    expect(onExpire).toHaveBeenCalledTimes(1)

    // Staying expired must not retrigger the refresh on every tick.
    await vi.advanceTimersByTimeAsync(5_000)
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('retries every 10s while the quote stays expired (failed silent refresh)', async () => {
    mount()
    expiresAt.value = Date.now() + 30_000
    await nextTick()

    // The refresh triggered on expiry "fails": expiresAt is never renewed.
    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()
    expect(onExpire).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(10_000)
    await nextTick()
    expect(onExpire).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(10_000)
    await nextTick()
    expect(onExpire).toHaveBeenCalledTimes(3)
  })

  it('formats the countdown as m:ss', async () => {
    const countdown = mount()
    expiresAt.value = Date.now() + 65_000
    await nextTick()
    expect(countdown.countdownText.value).toBe('1:05')

    await vi.advanceTimersByTimeAsync(60_000)
    expect(countdown.countdownText.value).toBe('0:05')
  })

  it('does not call onExpire while disabled', async () => {
    mount()
    enabled.value = false
    expiresAt.value = Date.now() + 1_000
    await nextTick()

    await vi.advanceTimersByTimeAsync(5_000)
    expect(onExpire).not.toHaveBeenCalled()
  })

  it('waits for the rate-limit cooldown before refreshing', async () => {
    const countdown = mount()
    expiresAt.value = Date.now() + 5_000
    rateLimitedUntil.value = Date.now() + 10_000
    await nextTick()

    await vi.advanceTimersByTimeAsync(5_000)
    await nextTick()
    expect(countdown.isExpired.value).toBe(true)
    expect(countdown.cooldownSecondsLeft.value).toBe(5)
    expect(onExpire).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(5_000)
    await nextTick()
    expect(countdown.cooldownSecondsLeft.value).toBe(null)
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('resets when a fresh quote arrives', async () => {
    const countdown = mount()
    expiresAt.value = Date.now() + 30_000
    await nextTick()

    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()
    expect(onExpire).toHaveBeenCalledTimes(1)

    // Simulates the store receiving the refreshed quote.
    expiresAt.value = Date.now() + 30_000
    await nextTick()
    expect(countdown.isExpired.value).toBe(false)
    expect(countdown.secondsLeft.value).toBe(30)
  })
})
