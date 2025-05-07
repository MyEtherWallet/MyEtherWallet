import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { wagmiConfig } from '@/providers/ethereum/wagmiConfig'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'

import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import { type WalletConfig } from '@/modules/access/common/walletConfigs'

export const useWagmiConnect = () => {
  const wagmiWalletData = ref('')
  const clickedWallet = ref<WalletConfig | undefined>()
  const openWalletConnectModal = ref(false)

  const { connectors } = wagmiConfig
  const walletStore = useWalletStore()
  const { setWallet } = walletStore
  const router = useRouter()

  const connect = async (wallet: WalletConfig) => {
    if ('routeName' in wallet && wallet.routeName) {
      router.push({ name: wallet.routeName })
    } else {
      const _icon =
        typeof wallet.icon === 'string' ? wallet.icon : await wallet.icon()
      wallet.icon = _icon
      clickedWallet.value = wallet
      const connector = connectors.find(
        c =>
          c.id === wallet.id ||
          (c.rkDetails as { id: string })?.id === wallet.id,
      )
      connector?.emitter.on('message', msg => {
        if (msg.type === 'display_uri') {
          wagmiWalletData.value = msg.data as string // possibly a temp fix
          openWalletConnectModal.value = true
          console.log(
            'WalletConnect URI:',
            openWalletConnectModal.value,
            wagmiWalletData.value,
          )
        }
      })
      const wagWallet = new WagmiWallet(connector!, '0x1')
      wagWallet.connect().then(res => {
        if (res) {
          try {
            wagmiWalletData.value = ''
            openWalletConnectModal.value = false
            setWallet(wagWallet)
            router.push({ name: ROUTES_WALLET.DASHBOARD.NAME })
          } catch (error) {
            console.error('WalletConnect connect failed:', error)
          }
        }
      })
    }
  }
  return {
    wagmiWalletData,
    openWalletConnectModal,
    clickedWallet,
    connect,
  }
}
