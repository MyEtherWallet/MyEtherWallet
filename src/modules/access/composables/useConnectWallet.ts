import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { generateConfig } from '@/providers/ethereum/wagmiConfig'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'
import { useWalletStore } from '@/stores/walletStore'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import {
  type WalletConfig,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'
import { useProviderStore } from '@/stores/providerStore'
import { storeToRefs } from 'pinia'
import { useAccessStore } from '@/stores/accessStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { ROUTES_ACCESS } from '@/router/routeNames'
import { useI18n } from 'vue-i18n'
import Web3InjectedWallet from '@/providers/ethereum/web3InjectedWallet'

export const useConnectWallet = () => {
  const { t } = useI18n()
  const wagmiWalletData = ref('')
  const clickedWallet = ref<WalletConfig | undefined>()
  const openWalletConnectModal = ref(false)

  const providerStore = useProviderStore()
  const chainsStore = useChainsStore()
  const { selectedChain, chains } = storeToRefs(chainsStore)
  const wagmiConfig = generateConfig(chains.value)
  const { providers: Eip6963Providers } = storeToRefs(providerStore)
  const { connectors } = wagmiConfig
  const walletStore = useWalletStore()
  const recentWalletsStore = useRecentWalletsStore()
  const { addWallet } = recentWalletsStore
  const { setWallet } = walletStore
  const router = useRouter()
  const route = useRoute()
  const toastStore = useToastStore()
  const accessStore = useAccessStore()

  const _storeWallet = (
    wallet: WagmiWallet | Web3InjectedWallet,
    config: WalletConfig,
  ) => {
    wagmiWalletData.value = ''
    openWalletConnectModal.value = false
    setWallet(wallet)
    addWallet(config)
    accessStore.closeAccessDialog()
  }

  const _connectWeb3 = async (wallet: WalletConfig) => {
    const providerInjected = Eip6963Providers.value.find(
      p =>
        p.info.name.toLowerCase() === wallet.name.toLowerCase() ||
        p.info.name.toLowerCase() === wallet.id.toLowerCase(),
    )

    if (!providerInjected) {
      if (wallet.type.includes(WalletConfigType.MOBILE)) {
        // open wallet connect modal if it is also a mobile wallet and extension instance not found
        _connectWagmi(wallet)
      } else {
        toastStore.addToastMessage({
          text: `Web3 wallet not detected. Please install the ${wallet.name} extension.`,
          link: {
            title: 'Click here to install',
            url:
              wallet.downloadUrls?.browserExtension ||
              wallet.downloadUrls?.qrCode ||
              wallet.downloadUrls?.chrome ||
              wallet.downloadUrls?.firefox ||
              '',
          },
          type: ToastType.Error,
          isInfinite: true,
        })
      }
    } else {
      const web3Wallet = new Web3InjectedWallet(
        providerInjected,
        selectedChain.value?.chainID || '1',
      )

      web3Wallet
        .connect()
        .then(res => {
          if (res) {
            try {
              _storeWallet(web3Wallet, wallet)
            } catch (error) {
              toastStore.addToastMessage({
                text: `Web3 connect failed: ${error}`,
                type: ToastType.Error,
              })
            }
          }
        })
        .catch(err => {
          let error = t('error_connecting')
          let _type = ToastType.Warning
          openWalletConnectModal.value = false
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

  const _connectWagmi = (wallet: WalletConfig) => {
    const connector = connectors.find(
      c =>
        c.id === wallet.id || (c.rkDetails as { id: string })?.id === wallet.id,
    )
    connector?.onDisconnect()
    connector?.emitter.on('message', msg => {
      if (msg.type === 'display_uri') {
        wagmiWalletData.value = msg.data as string // possibly a temp fix
        openWalletConnectModal.value = true
      }
    })
    const wagWallet = new WagmiWallet(
      connector!,
      selectedChain.value?.chainID || '1',
      wagmiConfig,
    )

    wagWallet
      .connect()
      .then(res => {
        if (res) {
          try {
            _storeWallet(wagWallet, wallet)
          } catch (error: unknown) {
            toastStore.addToastMessage({
              text: error instanceof Error ? error.message : String(error),
              type: ToastType.Error,
            })
          }
        }
      })
      .catch(err => {
        let error = t('error_connecting')
        let _type = ToastType.Warning
        openWalletConnectModal.value = false
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

  const connect = async (wallet: WalletConfig) => {
    if (wallet.walletViewType) {
      if (route.name && route.name === ROUTES_ACCESS.ACCESS.NAME) {
        router.push({
          name: ROUTES_ACCESS.ACCESS.NAME,
          query: { type: wallet.walletViewType },
        })
      }
      accessStore.setCurrentView(wallet.walletViewType)
    } else {
      const _icon =
        typeof wallet.icon === 'string' ? wallet.icon : await wallet.icon()
      wallet.icon = _icon
      clickedWallet.value = wallet

      const isWeb3 = wallet.type.includes(WalletConfigType.EXTENSION)
      if (isWeb3) {
        _connectWeb3(wallet)
        return
      }

      _connectWagmi(wallet)
    }
  }
  return {
    wagmiWalletData,
    openWalletConnectModal,
    clickedWallet,
    connect,
  }
}
