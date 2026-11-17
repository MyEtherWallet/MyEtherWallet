/**
 * Leave the app for another page (for example the Google login). Wrapped so
 * callers can be tested: jsdom cannot navigate, and `location.assign` cannot
 * be spied on there.
 */
export const navigateTo = (url: string): void => {
  window.location.assign(url)
}
