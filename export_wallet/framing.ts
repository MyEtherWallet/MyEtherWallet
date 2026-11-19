/**
 * Whether the page is being shown inside another page's frame.
 *
 * The export page hands over a recovery phrase through Copy buttons: a site
 * that framed it could dress those buttons up as something else. So the page
 * refuses to start in a frame, whatever the host's response headers say.
 */
export const isFramed = (
  page: Pick<Window, 'top' | 'self'> = window,
): boolean => {
  try {
    return page.top !== page.self
  } catch {
    // A top window that cannot be read belongs to someone else.
    return true
  }
}
