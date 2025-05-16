import type { Config } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { createConfig, http } from '@wagmi/core'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'
import Configs from '@/configs'

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

export const wagmiConfig: Config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: connectorsLocal,
})
