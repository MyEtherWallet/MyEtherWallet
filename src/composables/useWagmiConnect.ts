import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { wagmiConfig } from '@/providers/ethereum/wagmiConfig'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'

import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { type WalletConfig, WalletConfigType } from '@/modules/access/common/walletConfigs'

import { useProviderStore } from '@/stores/providerStore'
import { storeToRefs } from 'pinia'

import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

export const useWagmiConnect = () => {
  const wagmiWalletData = ref('')
  const clickedWallet = ref<WalletConfig | undefined>()
  const openWalletConnectModal = ref(false)
  const toastStore = useToastStore()
  const providerStore = useProviderStore()
  const { providers: Eip6963Providers } = storeToRefs(providerStore)
  const { connectors } = wagmiConfig
  const walletStore = useWalletStore()
  const recentWalletsStore = useRecentWalletsStore()
  const { addWallet } = recentWalletsStore
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
      const providerInjected = Eip6963Providers.value.find(
        p => p.info.name === wallet.name,
      )
      const isWeb3 = wallet.type.includes(WalletConfigType.EXTENSION);
      if (isWeb3 && !providerInjected) {
        // TODO: add web3 wallet handler
        console.log(wallet)
        console.error('Web3 wallet not found in providers:', wallet.name)
        toastStore.addToastMessage({
          text: `Web3 wallet not detected. Please install the ${wallet.name} extension.`,
          link: {
            title: 'Click here to install',
            url: wallet.downloadUrls?.browserExtension || wallet.downloadUrls?.qrCode || wallet.downloadUrls?.chrome || wallet.downloadUrls?.firefox || '',
          },
          type: ToastType.Error,
          isInfinite: true,
        })
        return;
      }
      const wagWallet = new WagmiWallet(connector!, '0x1')
      wagWallet.connect().then(res => {
        if (res) {
          try {
            wagmiWalletData.value = ''
            openWalletConnectModal.value = false
            setWallet(wagWallet)
            addWallet(wallet)
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
