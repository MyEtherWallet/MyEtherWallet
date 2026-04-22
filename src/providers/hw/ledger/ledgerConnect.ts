import type Transport from '@ledgerhq/hw-transport'
import { NetworkNames } from '@enkryptcom/types'
import getDeviceInfo from '@ledgerhq/live-common/lib/hw/getDeviceInfo'
import openApp from '@ledgerhq/live-common/lib/hw/openApp'
import getAppAndVersion from '@ledgerhq/live-common/lib/hw/getAppAndVersion'
import { getLedgerAppName } from './configs'

export async function ensureLedgerApp(
  transport: Transport,
  networkName: NetworkNames,
): Promise<boolean> {
  const appName = getLedgerAppName(networkName)
  try {
    await getDeviceInfo(transport)
    try {
      await openApp(transport, appName)
      return true
    } catch {
      throw new Error(`Make sure you have ${appName} App installed on your ledger`)
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg === 'DeviceOnDashboardExpected') {
      const info = await getAppAndVersion(transport)
      if (info.name !== appName) {
        throw new Error(`Make sure you have ${appName} App opened`)
      }
      return true
    }
    throw e
  }
}
