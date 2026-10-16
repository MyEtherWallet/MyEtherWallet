<template>
  <div class="flex flex-col gap-5">
    <AccessStepIndicator :step="accessStep" />

    <!-- Step 1: pick the keystore file -->
    <template v-if="accessStep === 1">
      <AccessBanner
        :title="$t('access_wallet.advanced.banner_title')"
        :text="$t('access_wallet.advanced.banner_keystore')"
      />
      <div
        role="button"
        tabindex="0"
        data-testid="keystore-dropzone"
        class="flex cursor-pointer flex-col items-center gap-4 border-[1.5px] border-dashed px-6 py-8 text-center transition-colors"
        :class="
          fileInvalid
            ? 'rounded-12 border-border-error bg-background-error-subtle'
            : [
                'rounded-16 bg-white',
                isDragging ? 'border-border-brand' : 'border-border-default',
              ]
        "
        :aria-label="$t('access_wallet.advanced.drop_title')"
        @click="browse"
        @keydown.enter.space.prevent="browse"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <AppAvatar type="icon" size="l" badge-bottom>
          <template #icon><AppIcon name="keystore" /></template>
          <template #badge>
            <AppAvatarBadge type="icon">
              <AppIcon
                :name="fileInvalid ? 'x-mark' : 'plus'"
                :class="{ 'text-icon-error': fileInvalid }"
              />
            </AppAvatarBadge>
          </template>
        </AppAvatar>
        <div v-if="fileInvalid" data-testid="keystore-invalid">
          <p class="text-base font-semibold text-text-error">
            {{ $t('access_wallet.advanced.invalid_file_title') }}
          </p>
          <p class="text-sm text-text-subtle">
            {{ $t('access_wallet.advanced.invalid_file_hint') }}
            <span class="font-semibold text-text-brand">
              {{ $t('access_wallet.advanced.try_again') }}
            </span>
          </p>
        </div>
        <div v-else>
          <p class="text-base font-semibold">
            {{ $t('access_wallet.advanced.drop_title') }}
          </p>
          <p class="text-sm text-text-subtle">
            {{ $t('access_wallet.advanced.drop_or') }}
            <span class="font-semibold text-text-brand">
              {{ $t('access_wallet.advanced.browse_files') }}
            </span>
          </p>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept=".json,application/json"
          class="hidden"
          data-testid="keystore-file-input"
          @change="onFileChange"
        />
      </div>
      <AppBaseButton
        v-if="fileInvalid"
        data-testid="keystore-continue"
        class="w-full"
        disabled
      >
        {{ $t('access_wallet.advanced.continue') }}
      </AppBaseButton>
    </template>

    <!-- Step 2: unlock it -->
    <template v-else>
      <AccessCell
        truncate
        :title="fileInfo.name"
        :description="fileInfo.description"
      >
        <template #avatar>
          <AppAvatar type="icon" size="l">
            <template #icon><AppIcon name="keystore" /></template>
          </AppAvatar>
        </template>
        <template #trailing>
          <button
            type="button"
            class="shrink-0 text-[13px] font-semibold text-text-brand cursor-pointer"
            @click="changeFile"
          >
            {{ $t('access_wallet.advanced.change') }}
          </button>
        </template>
      </AccessCell>
      <div
        v-if="cannotDecrypt"
        data-testid="keystore-error-card"
        role="alert"
        class="flex flex-col items-center gap-2 rounded-16 bg-background-error-subtle p-6 text-center"
      >
        <AppIcon
          name="exclamation-triangle"
          variant="filled"
          size="l"
          class="text-icon-error"
        />
        <p class="text-base font-semibold text-text-error">
          {{ $t('access_wallet.advanced.cannot_decrypt_title') }}
        </p>
        <p class="text-sm text-text-subtle">
          {{ $t('access_wallet.advanced.cannot_decrypt_text') }}
        </p>
      </div>
      <AppInput
        v-else
        v-model="password"
        data-private
        type="password"
        :label="$t('access_wallet.advanced.password_label')"
        :placeholder="$t('access_wallet.advanced.password_placeholder')"
        :disabled="isUnlocking"
        :error-message="passwordError"
        :submit-disabled="submitIsDisabled"
        @enter="unlock"
      />
      <AppBaseButton
        data-testid="keystore-connect"
        class="w-full"
        :disabled="submitIsDisabled"
        :is-loading="isUnlocking"
        @click="unlock"
      >
        {{ $t('create_wallet.connect') }}
      </AppBaseButton>
    </template>

    <AccessHelpFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInput from '@/components/AppInput.vue'
import AccessBanner from './components/AccessBanner.vue'
import AccessCell from './components/AccessCell.vue'
import AccessHelpFooter from './components/AccessHelpFooter.vue'
import AccessStepIndicator from './components/AccessStepIndicator.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import {
  isKeystoreFile,
  isCorruptKeystoreError,
  unlockKeystore,
  type V3Keystore,
  type EthSaleKeystore,
  type MEWKeystore,
} from '@/modules/access/common/helpers'
import PrivateKeyWallet from '@/providers/ethereum/privateKeyWallet'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { analytics, ConnectWalletEvent } from '@/analytics'

const { t } = useI18n()
const accessStore = useAccessStore()
const { selectedChain, accessStep } = storeToRefs(accessStore)
const { setSelectedNetwork } = useGlobalStore()
const { setWallet } = useWalletStore()
const { addWallet } = useRecentWalletsStore()

/**------------------------
 * Step 1: keystore file
 -------------------------*/
type Keystore = EthSaleKeystore | V3Keystore | MEWKeystore
const fileInput = ref<HTMLInputElement | null>(null)
const keystore = ref<Keystore | null>(null)
const fileInfo = ref({ name: '', description: '' })
const fileInvalid = ref(false)
const isDragging = ref(false)

const browse = () => {
  if (!fileInput.value) return
  fileInput.value.value = ''
  fileInput.value.click()
}

const readFileText = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve(String(reader.result))
    reader.readAsText(file)
  })

const describeFile = (file: File, json: Record<string, unknown>) => {
  const size = `${Math.max(1, Math.round(file.size / 1024))} KB`
  const version = json.version ?? json.Version
  const kind = version
    ? t('access_wallet.advanced.keystore_version', { version })
    : t('access_wallet.advanced.keystore_kind')
  return `${size} · ${kind}`
}

const loadFile = async (file?: File) => {
  isDragging.value = false
  if (!file) return
  try {
    const json = JSON.parse(await readFileText(file))
    if (!isKeystoreFile(json)) throw new Error('Not a keystore')
    keystore.value = json
    fileInfo.value = { name: file.name, description: describeFile(file, json) }
    fileInvalid.value = false
    accessStep.value = 2
  } catch {
    fileInvalid.value = true
  }
}

const onFileChange = (evt: Event) =>
  loadFile((evt.target as HTMLInputElement).files?.[0])
const onDrop = (evt: DragEvent) => loadFile(evt.dataTransfer?.files?.[0])

/**------------------------
 * Step 2: password
 -------------------------*/
const password = ref('')
const passwordError = ref('')
const cannotDecrypt = ref(false)
const isUnlocking = ref(false)

watch(password, () => {
  passwordError.value = ''
})

const submitIsDisabled = computed(
  () =>
    password.value === '' ||
    passwordError.value !== '' ||
    cannotDecrypt.value ||
    isUnlocking.value,
)

const reset = () => {
  keystore.value = null
  password.value = ''
  passwordError.value = ''
  cannotDecrypt.value = false
}

// The header's Back (or "Change") returns to step 1 with a clean slate.
watch(accessStep, step => {
  if (step === 1) reset()
})

const changeFile = () => {
  accessStep.value = 1
}

const unlock = async () => {
  if (submitIsDisabled.value || !keystore.value) return
  isUnlocking.value = true
  try {
    const res = await unlockKeystore(
      keystore.value as V3Keystore,
      password.value,
    )
    const wallet = new PrivateKeyWallet(
      Buffer.from(res.getPrivateKey()),
      selectedChain.value?.chainID || '1',
    )
    reset()
    setWallet(wallet, 'keystore', walletConfigs.keystore.type[0])
    addWallet(walletConfigs.keystore)
    setSelectedNetwork(selectedChain.value?.name || '')
    accessStore.setCurrentView('default')
    analytics.trackConnectWalletEvent(ConnectWalletEvent.SUCCESS, {
      walletName: walletConfigs.keystore.id,
      walletType: walletConfigs.keystore.type[0],
      network: selectedChain.value?.name,
    })
    accessStore.closeAccessDialog()
  } catch (error) {
    if (isCorruptKeystoreError(error)) {
      cannotDecrypt.value = true
    } else {
      passwordError.value = t('access_wallet.advanced.incorrect_password')
    }
  } finally {
    isUnlocking.value = false
  }
}
</script>
