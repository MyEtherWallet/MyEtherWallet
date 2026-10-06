/**
 * Disabled primary CTA on the advanced connect screens: brand at 40% with a white
 * label (design: #A0BCF0) instead of AppBaseButton's grey. No DS token matches;
 * brand/40 is the closest and follows the brand colour in dark mode.
 * Keyed on aria-disabled, which AppBaseButton only sets from `disabled`, so the
 * loading state keeps the full brand fill.
 */
export const PRIMARY_DISABLED_CLASS =
  'aria-disabled:!bg-background-brand/40 aria-disabled:!text-white'
