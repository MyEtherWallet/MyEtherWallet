/**
 * The one MEW size scale (MEW-2364). 35 tokens, identical to Tailwind's default
 * `spacing` scale — same keys, same rem values — so `w-4`, `p-2.5`, `size-10`,
 * `gap-2`, `w-px` already resolve against it. Tailwind utilities are the
 * consumption path in templates; there is intentionally no parallel scale.
 *
 * `SIZE[token]` is the px value, for the rare table that does box arithmetic and
 * emits inline px (Avatar badge placement) and so cannot use a utility class.
 * The `--size-*` CSS vars in `assets/main.css` mirror this map and are the
 * contract designers reference; `/dev/sizes` renders both so a drift is visible.
 */
export const SIZE = {
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
} as const

export type SizeToken = keyof typeof SIZE

/** CSS custom-property name for a token: 0.5 → `--size-0-5`, `px` → `--size-px`. */
export const sizeVar = (token: SizeToken): string =>
  `--size-${String(token).replace('.', '-')}`

/** Tokens in scale order (ascending px), for the /dev/sizes gallery. */
export const SIZE_TOKENS: SizeToken[] = (Object.keys(SIZE) as SizeToken[]).sort(
  (a, b) => SIZE[a] - SIZE[b],
)
