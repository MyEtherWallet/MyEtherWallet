/**
 * Centralized button sizing.
 *
 * Mirrors the `_base/Button` Figma component (Size = S / M / L / XL), which is
 * the single source of truth for button geometry. Both AppBaseButton and
 * AppSegmentedControl read from here so a size tweak lands in one place.
 *
 * Horizontal padding is split the way the design is built: the button frame
 * carries `padding`, and the label wrapper inside it carries `labelPadding`.
 * Effective inline padding is the sum (S 12px, M 16px, L 24px, XL 24px).
 */
export const BTN_SIZES = ['small', 'medium', 'large', 'xlarge'] as const

export type BtnSize = (typeof BTN_SIZES)[number]

type BtnSizeSpec = {
  /** Outer frame padding. */
  padding: string
  /** Inner label-wrapper padding — also the gap between label and icons. */
  labelPadding: string
  /** Label type scale. */
  text: string
  /** Prefix / suffix icon box. */
  icon: string
  /** Loading spinner box, matched to the icon size. */
  spinner: string
}

export const BTN_SIZE_SPEC: Record<BtnSize, BtnSizeSpec> = {
  // Figma Size=S — h 28, px 8, py 4, label 14/20, icon 16
  small: {
    padding: 'px-2 py-1',
    labelPadding: 'px-1',
    text: 'text-s-14 leading-p-140 tracking-[-0.28px]',
    icon: 'size-4',
    spinner: 'w-4 h-4',
  },
  // Figma Size=M — h 40, px 12, py 9, label 16/22, icon 18
  medium: {
    padding: 'px-3 py-[9px]',
    labelPadding: 'px-1',
    text: 'text-s-16 leading-[22px] tracking-[-0.32px]',
    icon: 'size-[18px]',
    spinner: 'w-[18px] h-[18px]',
  },
  // Figma Size=L — h 48, px 16, py 13, label 16/22, icon 20
  large: {
    padding: 'px-4 py-[13px]',
    labelPadding: 'px-2',
    text: 'text-s-16 leading-[22px] tracking-[-0.32px]',
    icon: 'size-5',
    spinner: 'w-5 h-5',
  },
  // Figma Size=XL — h 57, px 16, py 17.5, label 16/22, icon 20
  xlarge: {
    padding: 'px-4 py-[17.5px]',
    labelPadding: 'px-2',
    text: 'text-s-16 leading-[22px] tracking-[-0.32px]',
    icon: 'size-5',
    spinner: 'w-5 h-5',
  },
}
