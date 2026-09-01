import { describe, it, expect } from 'vitest'
import {
  InvalidAddressError,
  WaitForTransactionReceiptTimeoutError,
} from 'viem'
import {
  isBenignPurchaseInfoForbidden,
  isBluetoothGattDisconnectedError,
  isCoinNotFoundApiError,
  isExpectedTradeClientError,
  isExtensionOrProviderError,
  isForeignStackOverflow,
  isIndexedDbMutationError,
  isInvalidWalletAddressError,
  isLockedDeviceError,
  isMetaMaskSdkDecryptError,
  isProviderNotFoundError,
  isRainbowKitNotFoundError,
  isStorageQuotaExceededError,
  isTransactionReceiptTimeoutError,
  isTrezorHandshakeError,
  isWalletConnectSubscribeInterruptedError,
} from '@/sentry/extensionNoise'
import configs from '@/configs'

describe('isExtensionOrProviderError', () => {
  it('is true for the EIP-1193 4900 "disconnected" rejection from an extension', () => {
    // The exact production payload (serialized plain object, no parsed frames).
    expect(
      isExtensionOrProviderError({
        code: 4900,
        message: 'The provider is disconnected from all chains.',
        stack:
          'Error: The provider is disconnected from all chains.\n    at s (chrome-extension://acmacodkjbdgmoleebolmdjonilkdbch/background.js:2:7674223)',
      }),
    ).toBe(true)
  })

  it('is true for benign EIP-1193 provider codes regardless of stack', () => {
    expect(isExtensionOrProviderError({ code: 4001 })).toBe(true) // user rejected
    expect(isExtensionOrProviderError({ code: 4901 })).toBe(true) // chain disconnected
    expect(isExtensionOrProviderError({ code: -32002 })).toBe(true) // request pending
  })

  it('is true when the stack points at any browser extension scheme', () => {
    expect(
      isExtensionOrProviderError({
        // no benign code → forces the chrome-extension stack branch
        message: 'boom',
        stack: 'Error\n    at s (chrome-extension://abc/background.js:1:1)',
      }),
    ).toBe(true)
    expect(
      isExtensionOrProviderError({
        message: 'boom',
        stack: 'Error\n    at moz-extension://abc/background.js:1:1',
      }),
    ).toBe(true)
    expect(
      isExtensionOrProviderError({
        message: 'boom',
        stack: 'Error\n    at safari-web-extension://abc/x.js:1:1',
      }),
    ).toBe(true)
  })

  it('is false for a genuine app error (no extension stack, non-provider code)', () => {
    expect(
      isExtensionOrProviderError({
        message: "Cannot read properties of undefined (reading 'x')",
        stack:
          'TypeError: ...\n    at https://app.myetherwallet.com/assets/index-abc.js:1:1',
      }),
    ).toBe(false)
  })

  it('is false for non-benign provider-looking codes (e.g. -32603 internal)', () => {
    expect(isExtensionOrProviderError({ code: -32603, message: 'Internal' })).toBe(
      false,
    )
  })

  it('is false for non-object inputs', () => {
    expect(isExtensionOrProviderError(null)).toBe(false)
    expect(isExtensionOrProviderError(undefined)).toBe(false)
    expect(isExtensionOrProviderError('chrome-extension://x')).toBe(false)
    expect(isExtensionOrProviderError(new Error('plain'))).toBe(false)
  })
})

describe('isInvalidWalletAddressError', () => {
  it('is true for a real viem InvalidAddressError instance', () => {
    // The exact production trigger: a wallet returns a malformed account
    // address from eth_requestAccounts and viem's getAddress throws.
    const err = new InvalidAddressError({
      address: '87ee29ce5319f07638605abc5f053e40d4e1b1d94e',
    })
    expect(isInvalidWalletAddressError(err)).toBe(true)
  })

  it('is true for the serialized production payload (plain object with name)', () => {
    // Sentry hands beforeSend the original exception, but be robust to a
    // serialized plain object carrying only the viem error name.
    expect(
      isInvalidWalletAddressError({
        name: 'InvalidAddressError',
        message: 'Address "87ee29ce…94e" is invalid.',
      }),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isInvalidWalletAddressError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isInvalidWalletAddressError(new Error('boom'))).toBe(false)
    expect(
      isInvalidWalletAddressError({ name: 'SomeOtherError', message: 'x' }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isInvalidWalletAddressError(null)).toBe(false)
    expect(isInvalidWalletAddressError(undefined)).toBe(false)
    expect(isInvalidWalletAddressError('InvalidAddressError')).toBe(false)
  })
})

describe('isProviderNotFoundError', () => {
  it('is true for a wagmi ProviderNotFoundError (matched by name)', () => {
    // The exact production trigger: a connector calls getProvider() with no
    // injected wallet present and @wagmi/core throws ProviderNotFoundError.
    expect(
      isProviderNotFoundError({
        name: 'ProviderNotFoundError',
        message: 'Provider not found.',
      }),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(isProviderNotFoundError(new Error('boom'))).toBe(false)
    expect(
      isProviderNotFoundError({ name: 'TypeError', message: 'x' }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isProviderNotFoundError(null)).toBe(false)
    expect(isProviderNotFoundError(undefined)).toBe(false)
    expect(isProviderNotFoundError('Provider not found.')).toBe(false)
  })
})

describe('isStorageQuotaExceededError', () => {
  it('is true for a real DOMException QuotaExceededError (async IndexedDB write)', () => {
    // The exact production trigger: a third-party library's IndexedDB write
    // rejects when the browser's per-origin quota is exhausted.
    const err = new DOMException(
      'The current transaction exceeded its quota limitations.',
      'QuotaExceededError',
    )
    expect(isStorageQuotaExceededError(err)).toBe(true)
  })

  it('is true for the serialized production payload (plain object with name)', () => {
    expect(
      isStorageQuotaExceededError({
        name: 'QuotaExceededError',
        message: 'The current transaction exceeded its quota limitations.',
      }),
    ).toBe(true)
  })

  it('is true when only the legacy DOMException code 22 survives serialization', () => {
    // Sentry tags this issue with `DOMException.code: 22` (QUOTA_EXCEEDED_ERR).
    expect(isStorageQuotaExceededError({ code: 22, message: 'quota' })).toBe(
      true,
    )
  })

  it('is false for a genuine app error', () => {
    expect(
      isStorageQuotaExceededError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(
      isStorageQuotaExceededError({ name: 'SomeOtherError', code: 1 }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isStorageQuotaExceededError(null)).toBe(false)
    expect(isStorageQuotaExceededError(undefined)).toBe(false)
    expect(isStorageQuotaExceededError('QuotaExceededError')).toBe(false)
  })
})

describe('isTrezorHandshakeError', () => {
  it('is true for the Trezor Connect "handshake failed" Error', () => {
    // The exact production trigger: the Trezor Connect popup/iframe fails to
    // handshake with connect.trezor.io and @trezor/connect throws a plain Error.
    expect(isTrezorHandshakeError(new Error('handshake failed'))).toBe(true)
  })

  it('is true for the serialized production payload (plain object with message)', () => {
    expect(isTrezorHandshakeError({ message: 'handshake failed' })).toBe(true)
  })

  it('matches regardless of surrounding text / casing', () => {
    expect(
      isTrezorHandshakeError(new Error('TrezorConnect: Handshake failed')),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isTrezorHandshakeError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isTrezorHandshakeError(new Error('popup failed to open'))).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isTrezorHandshakeError(null)).toBe(false)
    expect(isTrezorHandshakeError(undefined)).toBe(false)
    expect(isTrezorHandshakeError('handshake failed')).toBe(false)
  })
})

describe('isForeignStackOverflow', () => {
  // Builds a Sentry ErrorEvent-shaped payload for a single exception value.
  const evt = (
    value: string,
    frames?: Array<{ filename?: unknown }>,
    type = 'RangeError',
  ) => ({
    exception: {
      values: [
        {
          type,
          value,
          ...(frames ? { stacktrace: { frames } } : {}),
        },
      ],
    },
  })

  it('is true for the production payload: iOS masked frame, no app origin', () => {
    // APP-MEW-WEB-BB: single frame Sentry could not attribute to a file
    // (rendered as `undefined:38:249`), from an injected/extension script.
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: undefined, lineno: 38, colno: 249 } as {
            filename?: unknown
          },
        ]),
      ),
    ).toBe(true)
  })

  it('is true when frames point at iOS webkit-masked-url (extension/injected)', () => {
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: 'webkit-masked-url://hidden/' },
        ]),
      ),
    ).toBe(true)
  })

  it('is true when there is no parsed stacktrace at all', () => {
    expect(
      isForeignStackOverflow(evt('Maximum call stack size exceeded.')),
    ).toBe(true)
  })

  it('is true regardless of exception type when the message matches', () => {
    // Some iOS payloads surface the message on a generic Error type.
    expect(
      isForeignStackOverflow(
        evt(
          'RangeError: Maximum call stack size exceeded',
          [{ filename: undefined }],
          'Error',
        ),
      ),
    ).toBe(true)
  })

  it('is FALSE for a genuine in-app stack overflow (carries an app frame)', () => {
    // A real MEW recursion — must NOT be dropped.
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: 'https://app.myetherwallet.com/assets/index-abc.js' },
        ]),
      ),
    ).toBe(false)
  })

  it('is FALSE when an app frame appears anywhere among masked frames', () => {
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: 'webkit-masked-url://hidden/' },
          { filename: undefined },
          { filename: 'https://app.myetherwallet.com/assets/chunk-x.js' },
        ]),
      ),
    ).toBe(false)
  })

  it('is FALSE for a localhost (dev) app frame', () => {
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: 'https://localhost:8080/src/App.vue' },
        ]),
      ),
    ).toBe(false)
  })

  it('is FALSE for a relative /assets/ app bundle path', () => {
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: '/assets/index-abc.js' },
        ]),
      ),
    ).toBe(false)
  })

  it('is true for an extension bundle whose path merely contains /assets/', () => {
    // `/assets/` must be anchored: chrome-extension://…/assets/… is NOT ours.
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: 'chrome-extension://abcd/assets/foo.js' },
        ]),
      ),
    ).toBe(true)
  })

  it('is true for a look-alike host (not our anchored domain)', () => {
    expect(
      isForeignStackOverflow(
        evt('Maximum call stack size exceeded.', [
          { filename: 'https://notmyetherwallet.com/assets/x.js' },
        ]),
      ),
    ).toBe(true)
  })

  it('is FALSE for a non-stack-overflow error, even with no app frame', () => {
    expect(
      isForeignStackOverflow(
        evt("Cannot read properties of undefined (reading 'x')", [
          { filename: undefined },
        ]),
      ),
    ).toBe(false)
  })

  it('is FALSE for empty / non-object / frameless-exception inputs', () => {
    expect(isForeignStackOverflow(null)).toBe(false)
    expect(isForeignStackOverflow(undefined)).toBe(false)
    expect(isForeignStackOverflow({})).toBe(false)
    expect(isForeignStackOverflow({ exception: { values: [] } })).toBe(false)
  })
})

describe('isTransactionReceiptTimeoutError', () => {
  it('is true for a real viem WaitForTransactionReceiptTimeoutError instance', () => {
    const err = new WaitForTransactionReceiptTimeoutError({ hash: '0xabc' })
    expect(isTransactionReceiptTimeoutError(err)).toBe(true)
  })

  it('is true for the serialized production payload (plain object with name)', () => {
    // Sentry hands beforeSend the original exception, but be robust to a
    // serialized plain object carrying only the viem error name.
    expect(
      isTransactionReceiptTimeoutError({
        name: 'WaitForTransactionReceiptTimeoutError',
        message:
          'Timed out while waiting for transaction with hash "0x99…" to be confirmed.',
      }),
    ).toBe(true)
  })

  it('is true when nested in the cause chain', () => {
    expect(
      isTransactionReceiptTimeoutError({
        name: 'SomeWrapperError',
        cause: { name: 'WaitForTransactionReceiptTimeoutError' },
      }),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isTransactionReceiptTimeoutError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(
      isTransactionReceiptTimeoutError({
        name: 'SomeOtherError',
        message: 'x',
      }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isTransactionReceiptTimeoutError(null)).toBe(false)
    expect(isTransactionReceiptTimeoutError(undefined)).toBe(false)
    expect(
      isTransactionReceiptTimeoutError('WaitForTransactionReceiptTimeoutError'),
    ).toBe(false)
  })
})

describe('isRainbowKitNotFoundError', () => {
  it('is true for the Error-object rejection from the injected script', () => {
    expect(isRainbowKitNotFoundError(new Error('not found rainbowkit'))).toBe(
      true,
    )
    expect(
      isRainbowKitNotFoundError({ message: 'not found rainbowkit' }),
    ).toBe(true)
  })

  it('is true for a bare-string rejection', () => {
    expect(isRainbowKitNotFoundError('not found rainbowkit')).toBe(true)
    // Some handlers prefix the Error name onto the serialized value.
    expect(isRainbowKitNotFoundError('Error: not found rainbowkit')).toBe(true)
  })

  it('is false for our bundled rainbowkit "Connector not found" error', () => {
    expect(isRainbowKitNotFoundError(new Error('Connector not found'))).toBe(
      false,
    )
  })

  it('is false for genuine app errors and non-matching inputs', () => {
    expect(
      isRainbowKitNotFoundError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isRainbowKitNotFoundError(null)).toBe(false)
    expect(isRainbowKitNotFoundError(undefined)).toBe(false)
    expect(isRainbowKitNotFoundError({ message: 42 })).toBe(false)
    expect(isRainbowKitNotFoundError('something else')).toBe(false)
  })
})

describe('isBluetoothGattDisconnectedError', () => {
  it('is true for the exact Chrome DOMException from the Ledger BLE teardown', () => {
    // The exact production trigger (APP-MEW-WEB-1AY): the Ledger BLE transport
    // fire-and-forgets stopNotifications() after the GATT server disconnected.
    expect(
      isBluetoothGattDisconnectedError({
        name: 'NetworkError',
        code: 19,
        message:
          "Failed to execute 'stopNotifications' on 'BluetoothRemoteGATTCharacteristic': GATT Server is disconnected. Cannot perform GATT operations. (Re)connect first with `device.gatt.connect`.",
      }),
    ).toBe(true)
  })

  it('is true for a real DOMException instance', () => {
    expect(
      isBluetoothGattDisconnectedError(
        new Error(
          "Failed to execute 'readValue' on 'BluetoothRemoteGATTCharacteristic': GATT Server is disconnected.",
        ),
      ),
    ).toBe(true)
  })

  it('is true for a bare-string rejection', () => {
    expect(
      isBluetoothGattDisconnectedError(
        'NetworkError: GATT Server is disconnected. Cannot perform GATT operations.',
      ),
    ).toBe(true)
  })

  it('is false for a genuine app error', () => {
    expect(
      isBluetoothGattDisconnectedError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    // A different BLE error we do NOT want to blanket-suppress.
    expect(
      isBluetoothGattDisconnectedError(
        new Error('GATT operation already in progress'),
      ),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isBluetoothGattDisconnectedError(null)).toBe(false)
    expect(isBluetoothGattDisconnectedError(undefined)).toBe(false)
    expect(isBluetoothGattDisconnectedError({ message: 42 })).toBe(false)
    expect(isBluetoothGattDisconnectedError('something else')).toBe(false)
  })
})

describe('isMetaMaskSdkDecryptError', () => {
  it('drops the MetaMask SDK AES-GCM decrypt rejection (APP-MEW-WEB-CQ)', () => {
    const err = new Error('aes/gcm: invalid ghash tag')
    err.stack =
      'Error: aes/gcm: invalid ghash tag\n' +
      '    at decrypt (/assets/metamask-sdk-RwJkC4lN.js:1:193237)\n' +
      '    at /assets/metamask-sdk-RwJkC4lN.js:1:212867'
    expect(isMetaMaskSdkDecryptError(err)).toBe(true)
  })

  it('ignores the same message from a non-metamask-sdk frame', () => {
    const err = new Error('aes/gcm: invalid ghash tag')
    err.stack =
      'Error: aes/gcm: invalid ghash tag\n' +
      '    at decrypt (/assets/index-abc123.js:1:100)'
    expect(isMetaMaskSdkDecryptError(err)).toBe(false)
  })

  it('ignores an unrelated metamask-sdk error', () => {
    const err = new Error('some other failure')
    err.stack = 'Error: some other failure\n    at /assets/metamask-sdk-RwJkC4lN.js:1:1'
    expect(isMetaMaskSdkDecryptError(err)).toBe(false)
  })

  it('handles non-error inputs', () => {
    expect(isMetaMaskSdkDecryptError(null)).toBe(false)
    expect(isMetaMaskSdkDecryptError('aes/gcm: invalid ghash tag')).toBe(false)
    expect(isMetaMaskSdkDecryptError({})).toBe(false)
  })
})

describe('isIndexedDbMutationError', () => {
  it('is true for the production DOMException payload (Firefox idb-keyval write)', () => {
    // APP-MEW-WEB-1GG: a wallet-SDK idb-keyval write rejects on Firefox with
    // DOMException code 11 (InvalidStateError). Sentry hands beforeSend the
    // original exception, robust to a serialized plain object carrying the
    // browser-native name + code.
    expect(
      isIndexedDbMutationError({
        name: 'InvalidStateError',
        code: 11,
        message:
          'A mutation operation was attempted on a database that did not allow mutations.',
      }),
    ).toBe(true)
  })

  it('is true on the message alone when the numeric code is absent', () => {
    expect(
      isIndexedDbMutationError({
        name: 'InvalidStateError',
        message:
          'A mutation operation was attempted on a database that did not allow mutations.',
      }),
    ).toBe(true)
  })

  it('is false for an InvalidStateError that is not the IDB mutation failure', () => {
    // Every InvalidStateError carries code 11, so the code alone cannot gate
    // the filter — an unrelated InvalidStateError (e.g. from another Web API)
    // with a non-mutation message must NOT be dropped.
    expect(
      isIndexedDbMutationError({
        name: 'InvalidStateError',
        code: 11,
        message: 'The object is in an invalid state.',
      }),
    ).toBe(false)
  })

  it('is false for a genuine app error', () => {
    expect(
      isIndexedDbMutationError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(
      isIndexedDbMutationError({ name: 'SomeOtherError', code: 11 }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isIndexedDbMutationError(null)).toBe(false)
    expect(isIndexedDbMutationError(undefined)).toBe(false)
    expect(isIndexedDbMutationError('InvalidStateError')).toBe(false)
  })
})

describe('isExpectedTradeClientError', () => {
  it('is true for an OneInchFusion.getQuote 1inch 4xx error (expectedClientError)', () => {
    // The exact shape OneInchFusion.getQuote throws for a 1inch Fusion 400
    // (illiquid/unsupported pair, invalid params) — see APP-MEW-WEB-1F8.
    const err = new Error('Bad Request') as Error & {
      expectedClientError?: boolean
    }
    err.expectedClientError = true
    expect(isExpectedTradeClientError(err)).toBe(true)
  })

  it('is true for a flagged transient axios network error', () => {
    const err = new Error('Network Error') as Error & {
      transientNetworkError?: boolean
    }
    err.transientNetworkError = true
    expect(isExpectedTradeClientError(err)).toBe(true)
  })

  it('is true for the serialized production payload (plain object)', () => {
    expect(
      isExpectedTradeClientError({
        message: 'Bad Request',
        expectedClientError: true,
      }),
    ).toBe(true)
  })

  it('is false when the flag is explicitly false or absent', () => {
    expect(
      isExpectedTradeClientError(
        Object.assign(new Error('Bad Request'), {
          expectedClientError: false,
        }),
      ),
    ).toBe(false)
    expect(isExpectedTradeClientError(new Error('Some genuine 5xx failure'))).toBe(
      false,
    )
  })

  it('is false for a genuine app error carrying unrelated properties', () => {
    expect(
      isExpectedTradeClientError({ message: 'boom', code: 500 }),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isExpectedTradeClientError(null)).toBe(false)
    expect(isExpectedTradeClientError(undefined)).toBe(false)
    expect(isExpectedTradeClientError('Bad Request')).toBe(false)
  })
})

describe('isLockedDeviceError', () => {
  it('drops the @ledgerhq LockedDeviceError by name (APP-MEW-WEB-BH)', () => {
    const err = new Error('Ledger device: Locked device (0x5515)')
    err.name = 'LockedDeviceError'
    expect(isLockedDeviceError(err)).toBe(true)
  })

  it('matches by name even without the 0x5515 message', () => {
    expect(isLockedDeviceError({ name: 'LockedDeviceError' })).toBe(true)
  })

  it('matches the 0x5515 / "locked device" message shape on a plain Error', () => {
    // Covers a rethrow that lost the original @ledgerhq error name.
    expect(
      isLockedDeviceError(new Error('Ledger device: Locked device (0x5515)')),
    ).toBe(true)
    expect(
      isLockedDeviceError({ message: 'the LOCKED DEVICE needs unlocking' }),
    ).toBe(true)
  })

  it('is false for a genuine unrelated app error', () => {
    expect(
      isLockedDeviceError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(isLockedDeviceError({ name: 'TransportStatusError' })).toBe(false)
  })

  it('handles non-error inputs', () => {
    expect(isLockedDeviceError(null)).toBe(false)
    expect(isLockedDeviceError(undefined)).toBe(false)
    expect(isLockedDeviceError('Locked device (0x5515)')).toBe(false)
    expect(isLockedDeviceError({ message: 42 })).toBe(false)
  })
})

describe('isCoinNotFoundApiError', () => {
  it('is true for the mew-api "CoinGecko coin not found" 400 message', () => {
    // The exact production trigger (APP-MEW-WEB-1F3): GET
    // /v1/web/token-price-chart/coins/CRYN replies 400 with this body
    // message, which describeMewApiFetchError surfaces verbatim.
    expect(
      isCoinNotFoundApiError(new Error('CoinGecko coin not found: CRYN.')),
    ).toBe(true)
    expect(
      isCoinNotFoundApiError({ message: 'CoinGecko coin not found: CRYN.' }),
    ).toBe(true)
  })

  it('matches regardless of the token symbol or casing', () => {
    expect(
      isCoinNotFoundApiError(new Error('coingecko coin not found: FOO.')),
    ).toBe(true)
  })

  it('is false for other mew-api 400s that happen to mention "not found"', () => {
    expect(
      isCoinNotFoundApiError(new Error('Address not found: 0x0.')),
    ).toBe(false)
  })

  it('is false for a genuine app error', () => {
    expect(
      isCoinNotFoundApiError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isCoinNotFoundApiError(null)).toBe(false)
    expect(isCoinNotFoundApiError(undefined)).toBe(false)
    expect(isCoinNotFoundApiError('CoinGecko coin not found: CRYN.')).toBe(
      false,
    )
  })
})

describe('isBenignPurchaseInfoForbidden', () => {
  it('is true for the production tag pair: purchase/info + 403', () => {
    // The exact production shape: tags set by describeMewApiFetchError in the
    // shared useFetchMewApi onFetchError handler.
    expect(
      isBenignPurchaseInfoForbidden({
        tags: {
          mew_api_url: configs.MEW_PURCHASE_API,
          mew_api_status: '403',
        },
      }),
    ).toBe(true)
  })

  it('is false for a different status on the same endpoint', () => {
    expect(
      isBenignPurchaseInfoForbidden({
        tags: {
          mew_api_url: configs.MEW_PURCHASE_API,
          mew_api_status: '500',
        },
      }),
    ).toBe(false)
  })

  it('is false for a 403 on a different MEW API endpoint (not swallowed)', () => {
    expect(
      isBenignPurchaseInfoForbidden({
        tags: {
          mew_api_url: `${configs.MEW_API_URL}/v1/some/other/route`,
          mew_api_status: '403',
        },
      }),
    ).toBe(false)
  })

  it('is false when tags are missing or the event has no tags', () => {
    expect(isBenignPurchaseInfoForbidden({})).toBe(false)
    expect(isBenignPurchaseInfoForbidden({ tags: {} })).toBe(false)
  })

  it('is false for non-object inputs', () => {
    expect(isBenignPurchaseInfoForbidden(null)).toBe(false)
    expect(isBenignPurchaseInfoForbidden(undefined)).toBe(false)
  })
})

describe('isWalletConnectSubscribeInterruptedError', () => {
  const MSG = 'Connection interrupted while trying to subscribe'

  it('drops the @walletconnect/core relay rejection (APP-MEW-WEB-61)', () => {
    // The exact production trigger: the relay WebSocket disconnects mid-connect
    // and the Relayer rejects with `new Error(...)`.
    expect(isWalletConnectSubscribeInterruptedError(new Error(MSG))).toBe(true)
  })

  it('is true for the serialized production payload (plain object with message)', () => {
    expect(isWalletConnectSubscribeInterruptedError({ message: MSG })).toBe(true)
  })

  it('is true for a bare-string rejection', () => {
    expect(isWalletConnectSubscribeInterruptedError(MSG)).toBe(true)
    expect(isWalletConnectSubscribeInterruptedError(`Error: ${MSG}`)).toBe(true)
  })

  it('does NOT over-match the sibling "Subscribing to X failed" shape', () => {
    expect(
      isWalletConnectSubscribeInterruptedError(
        new Error('Subscribing to abc123 failed, please try again'),
      ),
    ).toBe(false)
  })

  it('is false for a genuine app error', () => {
    expect(
      isWalletConnectSubscribeInterruptedError(
        new TypeError("Cannot read properties of undefined (reading 'x')"),
      ),
    ).toBe(false)
    expect(
      isWalletConnectSubscribeInterruptedError(new Error('Connection is closed')),
    ).toBe(false)
  })

  it('is false for non-matching inputs', () => {
    expect(isWalletConnectSubscribeInterruptedError(null)).toBe(false)
    expect(isWalletConnectSubscribeInterruptedError(undefined)).toBe(false)
    expect(isWalletConnectSubscribeInterruptedError({})).toBe(false)
    expect(isWalletConnectSubscribeInterruptedError({ message: 42 })).toBe(false)
    expect(isWalletConnectSubscribeInterruptedError('something else')).toBe(false)
  })
})
