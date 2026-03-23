const euCountries = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'EU',
]

const isEU = async (): Promise<boolean> => {
  try {
    const index = await fetch('https://partners.mewapi.io/ip-info')
      .then(res => res.json())
      .then(res => euCountries.findIndex(item => item === res.country))
    return index > -1
  } catch {
    return false
  }
}

export default isEU
