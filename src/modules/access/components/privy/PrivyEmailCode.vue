<script setup lang="ts">
// "Enter confirmation code" screen (Figma Onboarding 360:2442, error
// 362:2085, success 363:2158). Submits on the sixth digit; a wrong code
// clears the boxes and puts the cursor back in the first one.
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppCodeInput, {
  type CodeInputStatus,
} from '@/components/code_input/AppCodeInput.vue'
import AppIconContainer from '@/components/icon_container/AppIconContainer.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import PrivyScreen from './PrivyScreen.vue'

const props = defineProps<{
  email: string
  status: CodeInputStatus
  /** Seconds until the code can be resent; 0 = now. */
  resendIn: number
  /** No attempts left on this code: a new one must be requested. */
  locked: boolean
  /** A code is being checked or sent: nothing can be typed meanwhile. */
  busy?: boolean
}>()

const emit = defineEmits<{ complete: [code: string]; resend: [] }>()
const { t } = useI18n()

const code = ref('')
const input = ref<InstanceType<typeof AppCodeInput> | null>(null)
const canType = computed(
  () => !props.locked && !props.busy && props.status !== 'success',
)

// A wrong code empties the boxes.
watch(
  () => props.status,
  status => {
    if (status === 'error') code.value = ''
  },
)
// Whenever empty boxes can be typed into (the screen just opened, a wrong
// code was cleared, a new code was sent) the cursor goes to the first one.
watch(
  canType,
  async enabled => {
    if (!enabled || code.value) return
    await nextTick()
    input.value?.focus()
  },
  { immediate: true },
)
</script>

<template>
  <PrivyScreen :title="t('access_wallet.social.code.title')">
    <template #icon>
      <AppIconContainer icon="envelope" tone="info" />
    </template>
    <!-- The address and the code are personal: `data-private` keeps both out
         of session replay, as on the recovery phrase and key screens. -->
    <template #description>
      <p
        data-testid="code-sent-to"
        data-private
        class="text-text-sm text-text-subtle"
      >
        {{ t('access_wallet.social.code.description', { email }) }}
      </p>
    </template>
    <AppCodeInput
      ref="input"
      v-model="code"
      :status="status"
      :disabled="!canType"
      data-private
      :label="t('access_wallet.social.code.title')"
      class="w-full"
      @complete="emit('complete', $event)"
    />
    <p
      v-if="status === 'success'"
      class="text-label-sm text-text-success"
      role="status"
    >
      {{ t('access_wallet.social.code.success') }}
    </p>
    <template v-else>
      <!-- Shrink-wrapped so the icon stays beside its text when centred. -->
      <div v-if="status === 'error'" class="w-fit max-w-full text-left">
        <AppInputFeedback
          type="error"
          :message="
            t(
              locked
                ? 'access_wallet.social.code.too_many'
                : 'access_wallet.social.code.incorrect',
            )
          "
        />
      </div>
      <p class="flex items-center gap-1 text-text-sm text-text-subtle">
        {{ t('access_wallet.social.code.no_email') }}
        <AppBaseButton
          data-testid="resend-code"
          type="link"
          size="small"
          :disabled="resendIn > 0 || busy"
          @click="emit('resend')"
        >
          {{
            resendIn > 0
              ? t('access_wallet.social.code.resend_in', { seconds: resendIn })
              : t('access_wallet.social.code.resend')
          }}
        </AppBaseButton>
      </p>
    </template>
  </PrivyScreen>
</template>
