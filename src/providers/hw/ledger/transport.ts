import type Transport from '@ledgerhq/hw-transport'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'

export type LedgerTransportKind = 'webusb' | 'webble'

const BLE_OPEN_TIMEOUT_MS = 120_000
const USB_OPEN_TIMEOUT_MS = 60_000
const BLE_RETRY_DELAY_MS = 600

let cached: { transport: Transport; kind: LedgerTransportKind } | null = null
let inflight: Promise<Transport> | null = null
let lastKind: LedgerTransportKind | null = null

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
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

async function createWebUSB(): Promise<Transport | null> {
  if (!(await TransportWebUSB.isSupported())) return null
  const existing = await TransportWebUSB.openConnected().catch(() => null)
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
  try {
    const t = kind === 'webusb' ? await createWebUSB() : await createWebBLE()
    if (t) {
      attachLifecycle(t, kind)
      return t
    }
  } catch (e) {
    throw e
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

export async function getLedgerWebUSBTransport(): Promise<Transport> {
  cached = null
  inflight = null
  const t = await createWebUSB()
  if (!t) throw new Error('WebUSB is not supported in this browser')
  attachLifecycle(t, 'webusb')
  return t
}

export async function getLedgerBLETransport(): Promise<Transport> {
  cached = null
  inflight = null
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
