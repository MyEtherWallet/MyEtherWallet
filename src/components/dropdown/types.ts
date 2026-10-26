/**
 * Dropdown design-library types + trigger classes (Figma: MEW Web App — Design
 * Library › Dropdown, component set 2555:12846: Size M / S × Style on default /
 * on alternative × State).
 */
export type DropdownSize = 'm' | 's'

/**
 * Figma "Style", spelled `surface` like Picker, Chip and Cell: `default` sits
 * on the grey page and fills white, `alternative` sits on a white card and
 * fills grey.
 */
export type DropdownSurface = 'default' | 'alternative'

/**
 * Trigger box per size × surface, one static string each so Tailwind sees
 * every class. Hover / pressed are gated on `enabled:` so a disabled trigger
 * keeps its resting fill. Only M on default draws the `border/default`
 * hairline (Figma 0.5px, drawn as a 1px inset ring); focus swaps it for the
 * 2px `border/brand` ring.
 */
export const DROPDOWN_TRIGGER_CLASS: Record<
  DropdownSize,
  Record<DropdownSurface, string>
> = {
  m: {
    default:
      'flex h-13 w-full gap-2 rounded-16 px-4 py-1 bg-background-alternative ring-1 ring-inset ring-border-default enabled:hover:bg-background-alternative-hover enabled:active:bg-background-alternative-pressed',
    alternative:
      'flex h-13 w-full gap-2 rounded-16 px-4 py-1 bg-background-default enabled:hover:bg-background-default-hover enabled:active:bg-background-default-pressed',
  },
  s: {
    default:
      'inline-flex h-10 rounded-full px-2 py-1 bg-background-alternative enabled:hover:bg-background-alternative-hover enabled:active:bg-background-alternative-pressed',
    alternative:
      'inline-flex h-10 rounded-full px-2 py-1 bg-background-default enabled:hover:bg-background-default-hover enabled:active:bg-background-default-pressed',
  },
}

/** Focus and disabled are shared: 2px brand ring inside, content at 40%. */
export const DROPDOWN_TRIGGER_STATE_CLASS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-brand disabled:cursor-default disabled:*:opacity-40'

/**
 * Open menu placement: M takes the trigger's width, S keeps Figma's 240px
 * panel left-aligned under its narrower pill.
 */
export const DROPDOWN_MENU_WIDTH_CLASS: Record<DropdownSize, string> = {
  m: 'left-0 right-0',
  s: 'left-0 w-60',
}
