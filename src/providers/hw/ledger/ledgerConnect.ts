import type Transport from '@ledgerhq/hw-transport'
import { NetworkNames } from '@enkryptcom/types'
import getDeviceInfo from '@ledgerhq/live-common/lib/hw/getDeviceInfo'
import openApp from '@ledgerhq/live-common/lib/hw/openApp'
import quitApp from '@ledgerhq/live-common/lib/hw/quitApp'
import getAppAndVersion from '@ledgerhq/live-common/lib/hw/getAppAndVersion'
import { getLedgerAppName } from './configs'

export async function ensureLedgerApp(
  transport: Transport,
  networkName: NetworkNames,
): Promise<boolean> {
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
      return true
    } catch {
      throw new Error(`Make sure you have ${appName} App installed on your Ledger`)
    }
  }

  // An app is open — check which one
  const info = await getAppAndVersion(transport)
  if (info.name === appName) return true

  // Wrong app open — quit and open the correct one
  try {
    await quitApp(transport)
    await openApp(transport, appName)
    return true
  } catch {
    throw new Error(`Make sure you have ${appName} App installed on your Ledger`)
  }
}
