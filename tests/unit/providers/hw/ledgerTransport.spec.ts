import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Regression tests for the Ledger WebUSB "Unable to claim interface" error.
 *
 * WebUSB lets exactly one handle claim a device interface. Re-opening the
 * device over a transport we never released — a second "Connect via USB"
 * click after a back step, a failed unlock or a new access dialog — was the
 * in-app way to hit `Failed to execute 'claimInterface' on 'USBDevice':
 * Unable to claim interface.`; Ledger Live or another tab holding the device
 * is the external way. The transport module must release before re-opening,
 * retry a failed claim once after releasing, and otherwise surface a specific
 * error instead of falling through to `create()` (same device, same wall).
 */
const h = vi.hoisted(() => {
  const makeTransport = (label: string) => {
    const listeners: Record<string, Array<() => void>> = {}
    return {
      label,
      close: vi.fn(() => Promise.resolve()),
      on: vi.fn((event: string, fn: () => void) => {
        ;(listeners[event] ??= []).push(fn)
      }),
      off: vi.fn(),
      emit: (event: string) => listeners[event]?.forEach(fn => fn()),
    }
  }
  class TransportInterfaceNotAvailable extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'TransportInterfaceNotAvailable'
    }
  }
  const claimError = () =>
    new TransportInterfaceNotAvailable(
      "Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.",
    )
  return {
    makeTransport,
    claimError,
    usb: {
      isSupported: vi.fn(() => Promise.resolve(true)),
      openConnected: vi.fn(),
      create: vi.fn(),
    },
    ble: {
      isSupported: vi.fn(() => Promise.resolve(false)),
      create: vi.fn(),
    },
  }
})

vi.mock('@ledgerhq/hw-transport-webusb', () => ({ default: h.usb }))
vi.mock('@ledgerhq/hw-transport-web-ble', () => ({ default: h.ble }))

import {
  getLedgerWebUSBTransport,
  getLedgerTransport,
  closeLedgerTransport,
  isLedgerInterfaceBusyError,
  LedgerInterfaceBusyError,
} from '@/providers/hw/ledger/transport'

beforeEach(async () => {
  // Module-level cache persists across tests in this file — start each one released.
  await closeLedgerTransport()
  h.usb.isSupported.mockReset().mockResolvedValue(true)
  h.usb.openConnected.mockReset()
  h.usb.create.mockReset()
})

describe('getLedgerWebUSBTransport', () => {
  it('releases the transport it already holds before opening a new one (second Connect click)', async () => {
    const first = h.makeTransport('first')
    const second = h.makeTransport('second')
    h.usb.openConnected
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second)

    expect(await getLedgerWebUSBTransport()).toBe(first)
    expect(await getLedgerWebUSBTransport()).toBe(second)

    expect(first.close).toHaveBeenCalledTimes(1)
    // ...and it was closed BEFORE the second open, not after.
    expect(first.close.mock.invocationCallOrder[0]).toBeLessThan(
      h.usb.openConnected.mock.invocationCallOrder[1],
    )
    expect(h.usb.create).not.toHaveBeenCalled()
  })

  it('retries the claim once after releasing when the interface is held, and returns the retried transport', async () => {
    const recovered = h.makeTransport('recovered')
    h.usb.openConnected
      .mockRejectedValueOnce(h.claimError())
      .mockResolvedValueOnce(recovered)

    expect(await getLedgerWebUSBTransport()).toBe(recovered)
    expect(h.usb.openConnected).toHaveBeenCalledTimes(2)
    expect(h.usb.create).not.toHaveBeenCalled()
  })

  it('surfaces a specific busy error — and never falls through to create() — when the device stays held (Ledger Live / another tab)', async () => {
    h.usb.openConnected
      .mockRejectedValueOnce(h.claimError())
      .mockRejectedValueOnce(h.claimError())

    await expect(getLedgerWebUSBTransport()).rejects.toBeInstanceOf(
      LedgerInterfaceBusyError,
    )
    expect(h.usb.create).not.toHaveBeenCalled()
  })

  it('still asks for a device (create) when no already-permitted device is connected', async () => {
    const picked = h.makeTransport('picked')
    h.usb.openConnected.mockResolvedValueOnce(null)
    h.usb.create.mockResolvedValueOnce(picked)

    expect(await getLedgerWebUSBTransport()).toBe(picked)
    expect(h.usb.create).toHaveBeenCalledTimes(1)
  })

  it('swallows non-claim openConnected failures and falls back to create(), as before', async () => {
    const picked = h.makeTransport('picked')
    h.usb.openConnected.mockRejectedValueOnce(new Error('some other failure'))
    h.usb.create.mockResolvedValueOnce(picked)

    expect(await getLedgerWebUSBTransport()).toBe(picked)
  })
})

describe('getLedgerTransport (singleton used by the app wrappers)', () => {
  it('returns the connected transport without re-opening, and re-opens silently after a device disconnect', async () => {
    const first = h.makeTransport('first')
    const reopened = h.makeTransport('reopened')
    h.usb.openConnected
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(reopened)

    await getLedgerWebUSBTransport()
    expect(await getLedgerTransport()).toBe(first)
    expect(h.usb.openConnected).toHaveBeenCalledTimes(1)

    // The device re-enumerates (app switch / re-plug): the cache is dropped and
    // the next caller gets a fresh transport via the permitted-device path.
    first.emit('disconnect')
    expect(await getLedgerTransport()).toBe(reopened)
    expect(h.usb.openConnected).toHaveBeenCalledTimes(2)
    expect(h.usb.create).not.toHaveBeenCalled()
  })
})

describe('isLedgerInterfaceBusyError', () => {
  it("recognises Chrome's raw claimInterface message, the @ledgerhq error name, and our own error", () => {
    expect(
      isLedgerInterfaceBusyError(
        new Error(
          "Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.",
        ),
      ),
    ).toBe(true)
    expect(isLedgerInterfaceBusyError(h.claimError())).toBe(true)
    expect(isLedgerInterfaceBusyError(new LedgerInterfaceBusyError())).toBe(
      true,
    )
  })

  it('leaves other errors alone', () => {
    expect(
      isLedgerInterfaceBusyError(new Error('Locked device (0x5515)')),
    ).toBe(false)
    expect(isLedgerInterfaceBusyError(null)).toBe(false)
  })
})
