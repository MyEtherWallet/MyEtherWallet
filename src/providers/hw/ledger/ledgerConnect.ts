import type Transport from '@ledgerhq/hw-transport'
import { NetworkNames } from '@enkryptcom/types'
import getDeviceInfo from '@ledgerhq/live-common/lib/hw/getDeviceInfo'
import openApp from '@ledgerhq/live-common/lib/hw/openApp'
import quitApp from '@ledgerhq/live-common/lib/hw/quitApp'
import getAppAndVersion from '@ledgerhq/live-common/lib/hw/getAppAndVersion'
import { getLedgerAppName } from './configs'
import { getLedgerTransport, closeLedgerTransport } from './transport'

const APP_LAUNCH_DELAY_MS = 3_000

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

async function reconnect(): Promise<Transport> {
  await closeLedgerTransport()
  await sleep(APP_LAUNCH_DELAY_MS)
  return getLedgerTransport()
}

export async function ensureLedgerApp(
  transport: Transport,
  networkName: NetworkNames,
): Promise<Transport> {
  const appName = getLedgerAppName(networkName)

  let onDashboard: boolean
  try {
    await getDeviceInfo(transport)
    onDashboard = true
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (!msg.includes('DeviceOnDashboardExpected')) throw e
    onDashboard = false
  }

  if (onDashboard) {
    try {
      await openApp(transport, appName)
    } catch {
      throw new Error(`Make sure you have ${appName} App installed on your Ledger`)
    }
    // openApp causes a USB disconnect/reconnect — wait for the device to come back
    return reconnect()
  }

  // An app is open — check which one
  const info = await getAppAndVersion(transport)
  if (info.name === appName) return transport

  // Wrong app — quit (disconnect), reconnect at dashboard, then open correct app
  try {
    await quitApp(transport)
  } catch {
    throw new Error(`Make sure you have ${appName} App installed on your Ledger`)
  }
  const dashboardTransport = await reconnect()

  try {
    await openApp(dashboardTransport, appName)
  } catch {
    throw new Error(`Make sure you have ${appName} App installed on your Ledger`)
  }
  return reconnect()
}
