<template>
  <app-modal
    v-model="isOpen"
    :title="$t('multi_address.rename.title')"
    :subtitle="$t('multi_address.rename.subtitle')"
  >
    <!-- The modal header already pads its bottom (16px, 24px from sm); pt-4
         sm:pt-2 here keeps the header↔content gap at 32px per design. -->
    <div class="flex flex-col gap-4 px-6 pt-4 sm:pt-2 pb-6">
      <div class="flex flex-col gap-1">
        <input
          ref="inputRef"
          v-model="draft"
          data-test="rename-modal-input"
          :placeholder="$t('multi_address.rename.placeholder')"
          class="h-12 w-full rounded-[24px] border px-5 text-s-14 text-black outline-none placeholder:text-text-placeholder"
          :class="
            isDuplicate ? 'border-border-error' : 'border-border-default'
          "
          @keyup.enter="save"
        />
        <AppInputFeedback
          v-if="isDuplicate"
          data-test="rename-modal-error"
          type="error"
          :message="$t('multi_address.rename.duplicate')"
        />
      </div>
      <button
        data-test="rename-modal-save"
        class="h-12 w-full rounded-[24px] text-s-16 font-semibold transition-colors"
        :class="
          isDisabled
            ? 'bg-background-default text-text-muted cursor-not-allowed'
            : 'bg-background-brand text-white'
        "
        :disabled="isDisabled"
        @click="save"
      >
        {{ $t('multi_address.rename.save') }}
      </button>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import AppModal from '@/components/modal/AppModal.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'

const isOpen = defineModel<boolean>('isOpen', { default: false })
const props = defineProps<{
  currentName?: string
  /** Returns true if the trimmed name is already used by another saved address. */
  nameTaken?: (name: string) => boolean
}>()
const emit = defineEmits<{ save: [name: string] }>()

const draft = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

// Live uniqueness validation: shown as the user types so they see it before
// clicking Save. Drives both the error message and the Save disabled state.
const isDuplicate = computed<boolean>(() => {
  const name = draft.value.trim()
  return !!name && !!props.nameTaken?.(name)
})

// Disabled (grey) when empty or duplicate; enabled shows the primary style.
const isDisabled = computed<boolean>(
  () => !draft.value.trim() || isDuplicate.value,
)

// Prefill with the current name each time the modal opens, then focus the field.
watch(isOpen, async open => {
  if (!open) return
  draft.value = props.currentName ?? ''
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
})

const save = (): void => {
  const name = draft.value.trim()
  // Belt-and-suspenders: the button is disabled in these states, but re-check
  // on submit in case Save was triggered via Enter before the state settled.
  if (!name || isDuplicate.value) return
  emit('save', name)
  isOpen.value = false
}
</script>
