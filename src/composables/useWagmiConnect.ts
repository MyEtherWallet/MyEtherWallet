import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { wagmiConfig } from '@/providers/ethereum/wagmiConfig'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'
import { ToastType } from '@/types/notification/index'
import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import { type WalletConfig } from '@/modules/access/common/walletConfigs'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'
export const useWagmiConnect = () => {
  const { t } = useI18n()
  const wagmiWalletData = ref('')
  const clickedWallet = ref<WalletConfig | undefined>()
  const openWalletConnectModal = ref(false)

  const { connectors } = wagmiConfig
  const walletStore = useWalletStore()
  const { setWallet } = walletStore
  const router = useRouter()
  const toastStore = useToastStore()

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
      wagWallet
        .connect()
        .then(res => {
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
        .catch(err => {
          let error = t('error_connecting')
          let _type = ToastType.Warning
          if (
            err.message &&
            err.message.toLowerCase().includes('user rejected')
          ) {
            error = t('common.error.user_canceled_request')
            _type = ToastType.Info
          }
          toastStore.addToastMessage({
            text: error,
            type: _type,
          })
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
