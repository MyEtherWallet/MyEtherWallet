import { mainnet } from 'wagmi/chains'
import { createConfig, http } from 'wagmi'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import * as rainndowWallets from '@rainbow-me/rainbowkit/wallets'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
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

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: connectorsLocal,
})
