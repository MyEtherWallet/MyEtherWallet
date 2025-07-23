import { mainnet } from '@wagmi/core/chains'
import * as allChains from '@wagmi/core/chains'
import { createConfig, http, type Config } from '@wagmi/core'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'
import Configs from '@/configs'
import type { Chain } from '@/mew_api/types'
import type { Chain as wChain } from '@wagmi/core/chains'

const projectId = Configs.WALLET_CONNECT_PROJECT_ID
const allRainbowWallets = Object.values(rainndowWallets)
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
  return createConfig({
    chains: chains as [wChain, ...wChain[]],
    transports: transports,
    connectors: connectorsLocal,
  })
}
