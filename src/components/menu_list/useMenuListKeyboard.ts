import { onMounted, onUpdated, ref, type Ref } from 'vue'
import { MENU_LIST_ROW_SELECTOR } from './types'

type MenuListKeyboardOptions = {
  list: Ref<HTMLElement | null>
  /** Whether a search field sits above the rows (↑ from the first row and typeahead go there). */
  searchable: () => boolean
  focusSearch: () => void
  typeIntoSearch: (key: string) => void
}

/**
 * Keyboard model of a Menu List (WAI-ARIA listbox / menu pattern). The rows
 * are a single Tab stop (roving tabindex), ↑/↓ move focus without wrapping and
 * Home/End jump to the ends. ↑ on the first row returns to the search field,
 * and a printable key on a row goes back to it with that character. Escape is
 * left to whoever owns the popover.
 */
export const useMenuListKeyboard = ({
  list,
  searchable,
  focusSearch,
  typeIntoSearch,
}: MenuListKeyboardOptions) => {
  const activeIndex = ref(0)

  const getRows = () =>
    Array.from(
      list.value?.querySelectorAll<HTMLElement>(MENU_LIST_ROW_SELECTOR) ?? [],
    )

  // Rows render their own tabindex="0" (AppCell), so the roving stop is set on
  // the DOM after every render, also when filtering changes the rows.
  const syncTabStops = () => {
    const rows = getRows()
    activeIndex.value = Math.min(
      activeIndex.value,
      Math.max(rows.length - 1, 0),
    )
    rows.forEach((row, index) => {
      row.tabIndex = index === activeIndex.value ? 0 : -1
    })
  }

  onMounted(syncTabStops)
  onUpdated(syncTabStops)

  const focusRow = (index: number) => {
    const row = getRows()[index]
    if (!row) return
    activeIndex.value = index
    syncTabStops()
    row.focus({ preventScroll: true })
    row.scrollIntoView?.({ block: 'nearest' })
  }

  // Clicking or tabbing onto a row makes it the Tab stop.
  const onFocusIn = (event: FocusEvent) => {
    const index = getRows().indexOf(event.target as HTMLElement)
    if (index === -1 || index === activeIndex.value) return
    activeIndex.value = index
    syncTabStops()
  }

  const onKeydown = (event: KeyboardEvent) => {
    const rows = getRows()
    const current = rows.indexOf(event.target as HTMLElement)
    // Keys pressed on a control inside a row (e.g. the watchlist star) stay there.
    if (current === -1) return

    const last = rows.length - 1
    const isPrintable =
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey

    if (event.key === 'ArrowDown') focusRow(Math.min(current + 1, last))
    else if (event.key === 'ArrowUp' && current === 0 && searchable())
      focusSearch()
    else if (event.key === 'ArrowUp') focusRow(Math.max(current - 1, 0))
    else if (event.key === 'Home') focusRow(0)
    else if (event.key === 'End') focusRow(last)
    else if (isPrintable && searchable()) typeIntoSearch(event.key)
    else return
    event.preventDefault()
  }

  return { focusRow, onFocusIn, onKeydown }
}
