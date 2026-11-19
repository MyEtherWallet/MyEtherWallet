import { describe, it, expect } from 'vitest'
import { checkCustomPath } from '@/utils/customPathHelpers'

describe('checkCustomPath', () => {
  it.each(["m/44'/60'/0'/0", "m/44'/60'/1'", "m/0'/0'/0'", ' m/44/60 '])(
    'accepts %s',
    path => expect(checkCustomPath(path)).toBe(true),
  )

  it.each([
    'm',
    'm/',
    '44/60',
    "m/44'/60'/x",
    // hdkey reads "44h" as an unhardened 44, so these would derive elsewhere.
    'm/44h/60h/0h/0',
    'm/44H/60H',
    // hdkey throws "Invalid index" from 2^31 up.
    "m/2147483648'/0",
  ])('rejects %s', path => expect(checkCustomPath(path)).toBe(false))
})
