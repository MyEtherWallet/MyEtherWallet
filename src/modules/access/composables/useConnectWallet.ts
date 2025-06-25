import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { generateConfig } from '@/providers/ethereum/wagmiConfig'
import WagmiWallet from '@/providers/ethereum/wagmiWallet'
import { ROUTES_MAIN } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import {
  type WalletConfig,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'

import { useProviderStore } from '@/stores/providerStore'
import { storeToRefs } from 'pinia'

import { useAccessRedirectStore } from '@/stores/accessRedirectStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

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
  const toastStore = useToastStore()

  const _storeWallet = (
    wallet: WagmiWallet | Web3InjectedWallet,
    config: WalletConfig,
  ) => {
    wagmiWalletData.value = ''
    openWalletConnectModal.value = false
    const accessRedirectStore = useAccessRedirectStore()
    setWallet(wallet)
    addWallet(config)
    router.push({
      name: accessRedirectStore.lastVisitedRouteName || ROUTES_MAIN.HOME.NAME,
    })
  }

  const _connectWeb3 = async (wallet: WalletConfig) => {
    console.log(wallet)
    const providerInjected = Eip6963Providers.value.find(
      p => p.info.name.toLowerCase() === wallet.name.toLowerCase() || p.info.name.toLowerCase() === wallet.id.toLowerCase(),
    )

    if (!providerInjected) {
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
    if ('routeName' in wallet && wallet.routeName) {
      router.push({ name: wallet.routeName })
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
