import type Transport from '@ledgerhq/hw-transport'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'

export type LedgerTransportKind = 'webusb' | 'webble'

const BLE_OPEN_TIMEOUT_MS = 120_000
const USB_OPEN_TIMEOUT_MS = 60_000
const BLE_RETRY_DELAY_MS = 600
/** Pause between releasing a held interface and re-trying the claim. */
const CLAIM_RETRY_DELAY_MS = 300

let cached: { transport: Transport; kind: LedgerTransportKind } | null = null
let inflight: Promise<Transport> | null = null
let lastKind: LedgerTransportKind | null = null

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * WebUSB refused to claim the device's interface: `claimInterface` failed with
 * "Unable to claim interface" (surfaced by @ledgerhq as
 * `TransportInterfaceNotAvailable`). Something else holds the device — Ledger
 * Live, another tab, an extension, or a transport of ours that was never
 * released.
 */
export class LedgerInterfaceBusyError extends Error {
  constructor() {
    super(
      'Ledger is in use by another application or browser tab (Unable to claim interface)',
    )
    this.name = 'LedgerInterfaceBusyError'
  }
}

export function isLedgerInterfaceBusyError(e: unknown): boolean {
  const name = (e as { name?: string } | null)?.name
  const msg = e instanceof Error ? e.message : String(e ?? '')
  return (
    name === 'LedgerInterfaceBusyError' ||
    name === 'TransportInterfaceNotAvailable' ||
    /unable to claim interface|claimInterface/i.test(msg)
  )
}

function isUserCancelError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e ?? '')
  return (
    /user cancel(l)?ed/i.test(msg) ||
    /no device selected/i.test(msg) ||
    /NotFoundError/.test(msg)
  )
}

function isBleCancelError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e ?? '')
  return (
    isUserCancelError(e) ||
    /NotAllowedError/i.test(msg) ||
    /AbortError/i.test(msg) ||
    /permission.*denied/i.test(msg)
  )
}

function isTransientBleError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e ?? '')
  return (
    /GATT/i.test(msg) ||
    /disconnect/i.test(msg) ||
    /busy/i.test(msg) ||
    /operation failed/i.test(msg) ||
    /timeout/i.test(msg)
  )
}

function attachLifecycle(t: Transport, kind: LedgerTransportKind) {
  const onDisconnect = () => {
    if (cached?.transport === t) cached = null
    try {
      t.off('disconnect', onDisconnect)
    } catch {
      // listener API missing — ignore
    }
  }
  t.on('disconnect', onDisconnect)
  cached = { transport: t, kind }
  lastKind = kind
}

/**
 * Open an already-permitted USB Ledger without showing the picker.
 *
 * A claim failure is handled here rather than swallowed: falling through to
 * `create()` would retry the very same device, hit the same wall and — with no
 * user gesture — fail again with a less useful error. Instead release any
 * transport of ours (the usual in-app cause: a previous connect that was never
 * closed), retry the claim once, and if the device is still held raise
 * {@link LedgerInterfaceBusyError} so the UI can tell the user what to close.
 */
async function openConnectedWebUSB(): Promise<Transport | null> {
  try {
    return await TransportWebUSB.openConnected()
  } catch (e) {
    if (!isLedgerInterfaceBusyError(e)) return null
    await closeLedgerTransport()
    await sleep(CLAIM_RETRY_DELAY_MS)
    try {
      return await TransportWebUSB.openConnected()
    } catch (retryError) {
      if (isLedgerInterfaceBusyError(retryError)) {
        throw new LedgerInterfaceBusyError()
      }
      throw retryError
    }
  }
}

async function createWebUSB(): Promise<Transport | null> {
  if (!(await TransportWebUSB.isSupported())) return null
  const existing = await openConnectedWebUSB()
  if (existing) return existing
  return TransportWebUSB.create(USB_OPEN_TIMEOUT_MS, USB_OPEN_TIMEOUT_MS)
}

async function createWebBLEOnce(): Promise<Transport> {
  return TransportWebBLE.create(BLE_OPEN_TIMEOUT_MS, BLE_OPEN_TIMEOUT_MS)
}

const BLE_PICKER_TIMEOUT_MS = 60_000

async function createWebBLE(): Promise<Transport | null> {
  if (!(await TransportWebBLE.isSupported())) return null

  const timeout = new Promise<null>(r => setTimeout(() => r(null), BLE_PICKER_TIMEOUT_MS))
  let transient = false
  try {
    // Some browsers dismiss the BLE picker silently (no throw) — timeout so USB fallback isn't blocked.
    const result = await Promise.race([createWebBLEOnce(), timeout])
    if (result !== null) return result
  } catch (e) {
    if (isBleCancelError(e)) return null  // cancelled — skip retry, fall through to USB
    if (!isTransientBleError(e)) throw e
    transient = true
  }

  if (!transient) return null  // timed out — skip retry, fall through to USB

  // Transient BLE failures (GATT drops on first handshake) are common — retry once.
  await sleep(BLE_RETRY_DELAY_MS)
  try {
    return await createWebBLEOnce()
  } catch (e) {
    if (isBleCancelError(e)) return null
    throw e
  }
}

async function openPreferred(kind: LedgerTransportKind): Promise<Transport> {
  const t = kind === 'webusb' ? await createWebUSB() : await createWebBLE()
  if (t) {
    attachLifecycle(t, kind)
    return t
  }
  throw new Error(
    kind === 'webusb'
      ? 'Ledger: WebUSB is not supported in this browser.'
      : 'Ledger: Web Bluetooth is not supported in this browser.',
  )
}

export async function isWebUSBSupported(): Promise<boolean> {
  return TransportWebUSB.isSupported()
}

export async function isWebBLESupported(): Promise<boolean> {
  return TransportWebBLE.isSupported()
}

export async function getLedgerTransport(
  preferred?: LedgerTransportKind,
): Promise<Transport> {
  if (cached) return cached.transport
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const kind = preferred ?? lastKind
      if (!kind) throw new Error('Ledger: no transport kind specified.')
      return await openPreferred(kind)
    } finally {
      inflight = null
    }
  })()

  return inflight
}

/** Wait for an open in progress to finish (either way) before replacing it. */
async function settleInflight(): Promise<void> {
  if (!inflight) return
  try {
    await inflight
  } catch {
    // the caller is about to open a fresh transport anyway
  }
}

/**
 * Explicit "Connect via USB" click. Any transport we still hold is released
 * first: WebUSB lets a single handle claim the interface, so re-opening over an
 * unreleased one is exactly what produced "Unable to claim interface" on the
 * second connect.
 */
export async function getLedgerWebUSBTransport(): Promise<Transport> {
  await settleInflight()
  await closeLedgerTransport()
  const t = await createWebUSB()
  if (!t) throw new Error('WebUSB is not supported in this browser')
  attachLifecycle(t, 'webusb')
  return t
}

export async function getLedgerBLETransport(): Promise<Transport> {
  await settleInflight()
  await closeLedgerTransport()
  const t = await createWebBLE()
  if (!t) throw new Error('Web Bluetooth is not supported or was cancelled')
  attachLifecycle(t, 'webble')
  return t
}

export async function closeLedgerTransport(): Promise<void> {
  const current = cached
  cached = null
  if (!current) return
  try {
    await current.transport.close()
  } catch {
    // transport may already be closed or disconnected
  }
}

export function getActiveLedgerTransportKind(): LedgerTransportKind | null {
  return cached?.kind ?? null
}
