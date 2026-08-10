import { describe, it, expect } from 'vitest'
import { ref, computed, nextTick } from 'vue'
import {
  useBlockedContent,
  BLOCKED_CONTENT_CLASS,
} from '@/composables/useBlockedContent'

describe('BLOCKED_CONTENT_CLASS', () => {
  // Regression guard: the treatment was originally `blur-sm ... opacity-60`.
  // Sampling the perps design showed dimmed near-black text renders #BFBFBF
  // (25% over white) with crisp glyph edges — faded, never blurred.
  it('does not blur', () => {
    expect(BLOCKED_CONTENT_CLASS).not.toContain('blur')
  })

  it('dims to 25%', () => {
    expect(BLOCKED_CONTENT_CLASS).toContain('opacity-25')
  })

  it('disables pointer interaction', () => {
    expect(BLOCKED_CONTENT_CLASS).toContain('pointer-events-none')
  })
})

describe('useBlockedContent', () => {
  it('returns the blocked class when blocked', () => {
    const { blockedClass } = useBlockedContent(true)
    expect(blockedClass.value).toBe(BLOCKED_CONTENT_CLASS)
  })

  it('returns an empty string when not blocked, so it is safe to spread into :class', () => {
    const { blockedClass } = useBlockedContent(false)
    expect(blockedClass.value).toBe('')
  })

  it('tracks a ref', async () => {
    const isBlocked = ref(false)
    const { blockedClass } = useBlockedContent(isBlocked)
    expect(blockedClass.value).toBe('')

    isBlocked.value = true
    await nextTick()
    expect(blockedClass.value).toBe(BLOCKED_CONTENT_CLASS)
  })

  it('tracks a getter, which is how the multi-condition callers pass their state', async () => {
    const networkSupported = ref(true)
    const restricted = ref(false)
    const { blockedClass } = useBlockedContent(
      () => !networkSupported.value || restricted.value,
    )
    expect(blockedClass.value).toBe('')

    restricted.value = true
    await nextTick()
    expect(blockedClass.value).toBe(BLOCKED_CONTENT_CLASS)
  })

  it('tracks a computed', async () => {
    const source = ref(true)
    const { blockedClass } = useBlockedContent(computed(() => source.value))
    expect(blockedClass.value).toBe(BLOCKED_CONTENT_CLASS)

    source.value = false
    await nextTick()
    expect(blockedClass.value).toBe('')
  })
})
