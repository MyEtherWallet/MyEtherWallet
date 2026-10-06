<template>
  <div class="flex flex-col gap-5">
    <AccessBanner
      :title="$t('access_wallet.advanced.banner_title')"
      :text="$t('access_wallet.advanced.banner_private_key')"
    />
    <app-input
      v-model="privateKeyInput"
      data-private
      :label="$t('access_wallet.advanced.private_key_label')"
      :placeholder="$t('access_wallet.advanced.private_key_placeholder')"
      type="password"
      :aria-label="$t('access_wallet_private_key.private_key_input_label')"
      :disabled="isUnlocking"
      :submit-disabled="submitIsDisabled"
      :error-message="errorMessages"
      @enter="unlock"
    />
    <app-base-button
      class="w-full"
      :class="PRIMARY_DISABLED_CLASS"
      :disabled="submitIsDisabled"
      :is-loading="isUnlocking"
      @click="unlock"
    >
      {{ $t('create_wallet.connect') }}
    </app-base-button>
    <AccessHelpFooter />
  </div>
</template>

<script setup lang="ts">
import { PRIMARY_DISABLED_CLASS } from '@/modules/access/common/buttonStyles'
import { isValidPrivate } from '@ethereumjs/util'
import AccessBanner from './components/AccessBanner.vue'
import AccessHelpFooter from './components/AccessHelpFooter.vue'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import { getBufferFromHex, sanitizeHex } from '@/modules/access/common/helpers'
import EthereumPrivateKey from '@/providers/ethereum/privateKeyWallet'
import BitcoinPrivateKey from '@/providers/bitcoin/privateKeyWallet'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { isPrivateKey } from '@/modules/access/common/helpers'
import AppInput from '@/components/AppInput.vue'
import { hexToBytes } from '@ethereumjs/util'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { decode } from 'wif'
import bs58check from 'bs58check'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { analytics, ConnectWalletEvent } from '@/analytics'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const toastStore = useToastStore()
const { addToastMessage } = toastStore
const privateKeyInput = ref('')
const isUnlocking = ref(false)
/** Pasted keys often carry stray whitespace or a trailing newline. */
const keyValue = computed(() => privateKeyInput.value.trim())
const accessStore = useAccessStore()
const { selectedChain, isEvmChain, isBitcoinChain } = storeToRefs(accessStore)
const globalStore = useGlobalStore()
const { setSelectedNetwork: setSelectedChainGlobalStore } = globalStore

const walletStore = useWalletStore()
const { setWallet } = walletStore

const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore

const submitIsDisabled = computed<boolean>(() => {
  return keyValue.value === '' || !isValidPrivateKey.value || isUnlocking.value
})

const errorMessages = computed<string>(() => {
  //Error will be thrown by input component if empty
  if (keyValue.value === '') {
    return ''
  }

  if (!isValidPrivateKey.value) {
    return isEvmChain.value
      ? t('access_wallet.advanced.invalid_private_key')
      : t('access_wallet_private_key.invalid_private_key')
  }

  return ''
})

const strippedHexPrivateKey = computed<string>(() => {
  return keyValue.value.startsWith('0x')
    ? keyValue.value.replace('0x', '')
    : keyValue.value
})

const isValidPrivateKey = computed<boolean>(() => {
  try {
    if (isEvmChain.value) {
      const privateKey = Buffer.isBuffer(strippedHexPrivateKey.value)
        ? strippedHexPrivateKey.value
        : getBufferFromHex(sanitizeHex(strippedHexPrivateKey.value))
      return isPrivateKey(keyValue.value) && isValidPrivate(privateKey)
    }
    decode(strippedHexPrivateKey.value)
    return true
  } catch {
    return false
  }
})

const unlock = async () => {
  // TODO: remove hardcoded network id
  if (submitIsDisabled.value) return
  let wallet
  isUnlocking.value = true
  try {
    if (isEvmChain.value) {
      wallet = new EthereumPrivateKey(
        Buffer.from(hexToBytes(`0x${strippedHexPrivateKey.value}`)),
        selectedChain?.value?.chainID || '1',
      )
    } else if (isBitcoinChain.value) {
      const decoded = bs58check.decode(strippedHexPrivateKey.value)
      const rawPrivKey = decoded.slice(1, 33)
      wallet = new BitcoinPrivateKey(selectedChain?.value?.name || 'BITCOIN', {
        privateKey: Buffer.from(Buffer.from(rawPrivKey)),
      })
    }

    // Await the async setWallet so any getAddress()/restriction failure is
    // caught here and surfaced as a toast, instead of escaping as an unhandled
    // promise rejection (MEW-2185).
    await setWallet(
      wallet as WalletInterface,
      'privateKey',
      walletConfigs.privateKey.type[0],
    )
    addWallet(walletConfigs.privateKey)
    setSelectedChainGlobalStore(selectedChain.value?.name || '')
    privateKeyInput.value = ''
    accessStore.setCurrentView('default')
    analytics.trackConnectWalletEvent(ConnectWalletEvent.SUCCESS, {
      walletName: walletConfigs.privateKey.id,
      walletType: walletConfigs.privateKey.type[0],
      network: selectedChain.value?.name,
    })
    accessStore.closeAccessDialog()
  } catch (error) {
    addToastMessage({
      text: t('access_wallet_keystore.something_went_wrong'),
      textSecondary: (error as Error).message
        ? (error as Error).message
        : t('access_wallet_keystore.error_accessing_wallet'),
      type: ToastType.Error,
    })
    captureException(error, SENTRY_MODULE_TAGS.ACCESS)
  } finally {
    isUnlocking.value = false
  }
}
</script>
