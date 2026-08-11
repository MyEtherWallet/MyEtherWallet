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
import UnisatInjectWallet from '@/providers/bitcoin/unisatInjectedWallet'
import { useGlobalStore } from '@/stores/globalStore'
import { analytics, ConnectWalletEvent } from '@/analytics'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { isUserRejectionError } from '@/utils/walletUtils'

export const useConnectWallet = () => {
  const { t } = useI18n()
  const wagmiWalletData = ref('')
  const clickedWallet = ref<WalletConfig | undefined>()

  const providerStore = useProviderStore()
  const chainsStore = useChainsStore()
  const { chains } = storeToRefs(chainsStore)
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
  const { selectedChain, isBitcoinChain } = storeToRefs(accessStore)
  const globalStore = useGlobalStore()
  const { setSelectedNetwork: setSelectedChainGlobalStore } = globalStore

  const _storeWallet = (
    wallet: WagmiWallet | Web3InjectedWallet | UnisatInjectWallet,
    config: WalletConfig,
  ) => {
    wagmiWalletData.value = ''
    accessStore.setWagmiWalletData(wagmiWalletData.value) // clear stored data in access store as well
    setWallet(wallet, config.name, config.type[0])
    addWallet(config)
    setSelectedChainGlobalStore(selectedChain.value?.name || '')
    analytics.trackConnectWalletEvent(ConnectWalletEvent.SUCCESS, {
      walletName: config.name,
      walletType: config.type[0],
      network: selectedChain.value?.name,
    })
    accessStore.closeAccessDialog()
    toastStore.addToastMessage({
      text: t('access_wallet.toast.wallet_connected'),
      textSecondary: t('access_wallet.toast.wallet_connected_description', {
        name: config.name,
      }),
      type: ToastType.Success,
    })
  }

  const _connectWeb3 = async (wallet: WalletConfig) => {
    // skip everything else as wagmi doesn't support btc
    if (isBitcoinChain.value) {
      const unisatInjection = window.unisat
      const enkryptInjection = window.enkrypt?.providers?.bitcoin
      if (wallet.id === 'unisat' && !unisatInjection) {
        toastStore.addToastMessage({
          text: t('access_wallet.toast.wallet_not_detected', {
            wallet: 'Unisat',
          }),
          textSecondary: t('access_wallet.toast.install_extension', {
            name: wallet.name,
          }),
          type: ToastType.Warning,
        })
        return
      } else if (wallet.id === 'enkrypt' && !enkryptInjection) {
        toastStore.addToastMessage({
          text: t('access_wallet.toast.wallet_not_detected', {
            wallet: 'Enkrypt',
          }),
          textSecondary: t('access_wallet.toast.install_extension', {
            name: wallet.name,
          }),
          type: ToastType.Warning,
        })
        return
      }
      // Resolve the injected provider that matches the selected wallet.
      // Wallets other than Unisat / Enkrypt (e.g. SafePal) do not expose a
      // supported Bitcoin injection, so bail out gracefully instead of
      // dereferencing an undefined provider (MEW-2040).
      const btcInjection =
        wallet.id === 'unisat'
          ? unisatInjection
          : wallet.id === 'enkrypt'
            ? enkryptInjection
            : undefined
      if (!btcInjection) {
        toastStore.addToastMessage({
          text: 'Wallet not supported for Bitcoin',
          textSecondary: `${wallet.name} can't be used to connect to Bitcoin. Please select a different wallet.`,
          type: ToastType.Warning,
        })
        return
      }
      const unisatWallet = new UnisatInjectWallet(
        btcInjection,
        selectedChain.value?.name ?? 'BITCOIN',
      )

      // Show the web3_wallet view while connecting
      accessStore.clearWeb3ConnectionError()
      accessStore.setClickedWeb3Wallet(wallet)
      accessStore.setCurrentView('web3_wallet')

      unisatWallet
        .connect()
        .then(res => {
          if (res) {
            try {
              _storeWallet(unisatWallet, wallet)
            } catch (error) {
              accessStore.setWeb3ConnectionError(
                error instanceof Error ? error.message : String(error),
              )
              captureException(error, SENTRY_MODULE_TAGS.ACCESS)
            }
          } else {
            accessStore.setWeb3ConnectionError(t('error_connecting'))
          }
        })
        .catch(err => {
          let error = t('error_connecting')
          if (isUserRejectionError(err)) {
            error = t('common.error.user_canceled_request')
          }
          accessStore.setWeb3ConnectionError(error)
          if (error !== t('common.error.user_canceled_request')) {
            captureException(err, SENTRY_MODULE_TAGS.ACCESS)
          }
        })
      return
    }
    const providerInjected = Eip6963Providers.value.find(
      p => p.info.name === wallet.name || p.info.name === wallet.id,
    )

    if (!providerInjected) {
      if (wallet.type.includes(WalletConfigType.MOBILE)) {
        // open wallet connect modal if it is also a mobile wallet and extension instance not found
        _connectWagmi(wallet)
      } else {
        const _haslink =
          wallet.downloadUrls?.browserExtension ||
          wallet.downloadUrls?.qrCode ||
          wallet.downloadUrls?.chrome ||
          wallet.downloadUrls?.firefox
        const link = _haslink
          ? {
            title: t('access_wallet.toast.click_here_to_install'),
            url: _haslink,
          }
          : {
            title: t('common.dont_have_wallet'),
            url: 'https://enkrypt.com',
          }
        toastStore.addToastMessage({
          text: t('access_wallet.toast.web3_wallet_not_detected'),
          textSecondary: t('access_wallet.toast.install_extension_or_select', {
            name: wallet.name,
          }),
          link: link,
          type: ToastType.Warning,
          isInfinite: true,
        })
      }
    } else {
      const web3Wallet = new Web3InjectedWallet(
        providerInjected,
        selectedChain.value?.chainID || '1',
      )

      // Show the web3_wallet view while connecting
      accessStore.clearWeb3ConnectionError()
      accessStore.setClickedWeb3Wallet(wallet)
      accessStore.setCurrentView('web3_wallet')
      web3Wallet
        .connect()
        .then(res => {
          if (res) {
            try {
              _storeWallet(web3Wallet, wallet)
            } catch (error) {
              accessStore.setWeb3ConnectionError(
                error instanceof Error ? error.message : String(error),
              )
              captureException(error, SENTRY_MODULE_TAGS.ACCESS)
            }
          } else {
            accessStore.setWeb3ConnectionError(t('error_connecting'))
          }
        })
        .catch(err => {
          let error = t('error_connecting')
          if (isUserRejectionError(err)) {
            error = t('common.error.user_canceled_request')
          } else if (
            err.message &&
            err.message.toLowerCase().includes('already pending')
          ) {
            error = t('access_wallet.toast.connect_request_pending')
          } else if (
            err.message &&
            err.message.toLowerCase().includes('unrecognized chain id')
          ) {
            error = t('access_wallet.toast.network_not_supported')
          }
          accessStore.setWeb3ConnectionError(error)
          if (error === t('error_connecting')) {
            captureException(err, SENTRY_MODULE_TAGS.ACCESS)
          }
        })
    }
  }

  const _connectWagmi = (wallet: WalletConfig) => {
    accessStore.setClickedWalletConnect({
      walletName: wallet.name,
      walletIcon:
        typeof wallet.icon === 'string' ? wallet.icon : '' /* async */,
    })
    // open Wallet Connect View
    if (wallet.id === 'walletConnect')
      accessStore.setCurrentView('wallet_connect')

    // find connector by id
    // some connectors have different ids in our config vs wagmi (e.g. rabby)
    const connector = connectors.find(
      c =>
        c.id === wallet.id || (c.rkDetails as { id: string })?.id === wallet.id,
    )
    // No matching wagmi connector (e.g. wallet not installed / not registered).
    // Surface a friendly, handled error instead of constructing a WagmiWallet
    // with an undefined connector and dereferencing it on connect().
    if (!connector) {
      toastStore.addToastMessage({
        text: 'Wallet not available',
        textSecondary: `We couldn't connect to ${wallet.name}. Please select a different wallet or try again.`,
        type: ToastType.Warning,
      })
      return
    }
    connector.onDisconnect()
    connector.emitter.on('message', msg => {
      if (msg.type === 'display_uri') {
        wagmiWalletData.value = msg.data as string // possibly a temp fix
        accessStore.setWagmiWalletData(wagmiWalletData.value)
      }
    })
    const wagWallet = new WagmiWallet(
      connector,
      selectedChain.value?.chainID || '1',
      wagmiConfig,
    )
    return wagWallet
      .connect()
      .then(res => {
        if (res) {
          try {
            _storeWallet(wagWallet, wallet)
          } catch (error: unknown) {
            toastStore.addToastMessage({
              text: t('access_wallet.toast.could_not_connect'),
              textSecondary:
                error instanceof Error ? error.message : String(error),
              type: ToastType.Error,
            })
            captureException(error, SENTRY_MODULE_TAGS.ACCESS)
          }
        }
      })
      .catch(err => {
        let error = t('error_connecting')
        let _type = ToastType.Warning
        if (isUserRejectionError(err)) {
          error = t('common.error.user_canceled_request')
          _type = ToastType.Info
        } else if (
          err.message &&
          err.message.toLowerCase().includes('proposal expired')
        ) {
          error = t('access_wallet.toast.connection_timed_out')
          _type = ToastType.Info
        }
        toastStore.addToastMessage({
          text: t('access_wallet.toast.could_not_connect'),
          textSecondary: error,
          type: _type,
        })
        if (error === t('error_connecting')) {
          captureException(err, SENTRY_MODULE_TAGS.ACCESS)
        }
      })
  }

  const connectWallet = async (wallet: WalletConfig) => {
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

  const connect = async (wallet: WalletConfig) => {
    if (wallet.walletViewType) {
      if (route.name && route.name === ROUTES_ACCESS.ACCESS.NAME) {
        router.push({
          name: ROUTES_ACCESS.ACCESS.NAME,
          query: { type: wallet.walletViewType },
        })
      }
      if (wallet.walletViewType === 'wallet_connect') {
        accessStore.setClickedWalletConnect({
          walletName: wallet.name,
          walletIcon:
            typeof wallet.icon === 'string' ? wallet.icon : '' /* async */,
        })
        connectWallet(wallet)
      }
      accessStore.setCurrentView(wallet.walletViewType)
    } else {
      connectWallet(wallet)
    }
  }
  return {
    wagmiWalletData,
    clickedWallet,
    connect,
  }
}
