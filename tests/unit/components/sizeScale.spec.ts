import { describe, it, expect } from 'vitest'
import { SIZE, SIZE_TOKENS, sizeVar } from '@/components/sizeScale'
import { AVATAR_SIZES, STATUS_BADGE_BOX } from '@/components/avatar/types'

describe('size scale (MEW-2364)', () => {
  it('locks the 35-token scale to the Figma / Tailwind spec', () => {
    // Whole-map lock: any drift from the handoff table fails here.
    expect(SIZE).toEqual({
      0: 0,
      px: 1,
      0.5: 2,
      1: 4,
      1.5: 6,
      2: 8,
      2.5: 10,
      3: 12,
      3.5: 14,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      11: 44,
      12: 48,
      14: 56,
      16: 64,
      20: 80,
      24: 96,
      28: 112,
      32: 128,
      36: 144,
      40: 160,
      44: 176,
      48: 192,
      52: 208,
      56: 224,
      60: 240,
      64: 256,
      72: 288,
      80: 320,
      96: 384,
    })
    expect(Object.keys(SIZE)).toHaveLength(35)
  })

  it('matches Tailwind px = rem × 16 for every token (label = rem × 4)', () => {
    // Token label is the /4 spacing key, so px must be label × 4 (except `px`).
    for (const token of SIZE_TOKENS) {
      if (token === 'px') continue
      expect(SIZE[token]).toBe(Number(token) * 4)
    }
  })

  it('orders tokens ascending by px, 0 → 384', () => {
    expect(SIZE_TOKENS).toHaveLength(35)
    // Object.keys yields string keys — compare by resolved px, not identity.
    expect(SIZE[SIZE_TOKENS[0]]).toBe(0)
    expect(SIZE[SIZE_TOKENS.at(-1)!]).toBe(384)
    const px = SIZE_TOKENS.map(t => SIZE[t])
    expect(px).toEqual([...px].sort((a, b) => a - b))
  })

  it('keeps the off-scale exceptions out of the scale', () => {
    // Avatar XS box 18, badge 22, and AppAvatarCard 27 are Figma component
    // geometry, documented exceptions — they must never be absorbed as tokens.
    const values = Object.values(SIZE)
    expect(values).not.toContain(18)
    expect(values).not.toContain(22)
    expect(values).not.toContain(27)
  })

  it('names CSS vars with dots → dashes', () => {
    expect(sizeVar(0)).toBe('--size-0')
    expect(sizeVar('px')).toBe('--size-px')
    expect(sizeVar(0.5)).toBe('--size-0-5')
    expect(sizeVar(2.5)).toBe('--size-2-5')
    expect(sizeVar(12)).toBe('--size-12')
  })
})

describe('avatar geometry resolves through the scale unchanged', () => {
  it('keeps the exact Figma boxes after wiring to SIZE[]', () => {
    expect(AVATAR_SIZES.xs).toEqual({ box: 18, badgeBox: 12 })
    expect(AVATAR_SIZES.s).toEqual({ box: 24, badgeBox: 14 })
    expect(AVATAR_SIZES.m).toEqual({ box: 32, badgeBox: 18 })
    expect(AVATAR_SIZES.l).toEqual({ box: 40, badgeBox: 20 })
    expect(AVATAR_SIZES.xl).toEqual({ box: 48, badgeBox: 22 })
    expect(STATUS_BADGE_BOX).toBe(8)
  })
})
