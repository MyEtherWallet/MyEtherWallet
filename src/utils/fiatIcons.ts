/**
 * Shared fiat currency flag icons.
 * SVGs live in `src/assets/images/fiat/<CODE>.svg` and are used app-wide
 * (currency selector in Settings, buy/sell currency pickers, etc.).
 */
const fiatIconModules = import.meta.glob<string>('@/assets/images/fiat/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const fiatIconMap: Record<string, string> = Object.fromEntries(
  Object.entries(fiatIconModules).map(([path, url]) => {
    const filename = path.split('/').pop() ?? ''
    const code = filename.replace(/\.svg$/, '').toUpperCase()
    return [code, url]
  }),
)

export const getFiatIcon = (fiatCurrency: string): string | undefined => {
  return fiatIconMap[fiatCurrency.toUpperCase()]
}
