import { mainnet } from '@wagmi/core/chains'
import * as allChains from '@wagmi/core/chains'
import {
  createConfig,
  http,
  mock,
  type Config,
  type CreateConnectorFn,
} from '@wagmi/core'
import { connectorsForWallets, type WalletList } from '@rainbow-me/rainbowkit'
import * as rainbowWallets from '@rainbow-me/rainbowkit/wallets'

import Configs from '@/configs'
import type { Chain } from '@/mew_api/types'
import type { Chain as wChain } from '@wagmi/core/chains'

type CreateWalletFn = WalletList[number]['wallets'][number]

const REMOVED_WALLETS_ID = ['bitskiWallet', 'backpackWallet', 'portoWallet']

const projectId = Configs.WALLET_CONNECT_PROJECT_ID
const allRainbowWallets = Object.values(rainbowWallets).filter(wallet => {
  return (
    typeof wallet === 'function' &&
    'name' in wallet &&
    !REMOVED_WALLETS_ID.includes(wallet.name)
  )
}) as unknown as CreateWalletFn[]

const connectorsLocal = connectorsForWallets(
  [
    {
      groupName: 'MEW',
      wallets: allRainbowWallets,
    },
  ],
  {
    projectId,
    appName: 'MEW',
  },
)

export const generateConfig = (chainsFromApi: Chain[]): Config => {
  const filteredChains = chainsFromApi.filter(chain => {
    return chain.chainID
  })
  const chains: wChain[] = Object.values(allChains).filter((chain: wChain) => {
    return filteredChains.some((filteredChain: Chain) => {
      return chain.id === Number(filteredChain.chainID)
    })
  })

  if (chains.length === 0) {
    chains.push(mainnet)
  }

  const transports = chains.reduce(
    (acc: Record<number, ReturnType<typeof http>>, chain: wChain) => {
      acc[chain.id] = http()
      return acc
    },
    {} as Record<number, ReturnType<typeof http>>,
  )
  // RainbowKit still ships against wagmi 2 (@wagmi/core 2.x) while `mock` and
  // `createConfig` come from @wagmi/core 3.x, whose connector config gained a
  // `providers` field. Pin the array to the 3.x type: 2.x connector functions
  // are assignable to it (they accept a superset config), the reverse is not.
  const allConnectors: CreateConnectorFn[] = [...connectorsLocal]
  if (import.meta.env.MODE !== 'production') {
    const testAddress = import.meta.env.VITE_TEST_ADDRESS as string | undefined
    if (testAddress) {
      const mConnector = mock({
        accounts: [testAddress as `0x${string}`],
      })
      allConnectors.push(mConnector)
    }
  }

  return createConfig({
    chains: chains as [wChain, ...wChain[]],
    transports: transports,
    connectors: allConnectors,
  })
}
