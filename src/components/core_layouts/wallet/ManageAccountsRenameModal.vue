<template>
  <app-dialog
    v-model:is-open="isOpen"
    :has-content-gutter="true"
    class="w-full sm:max-w-[400px] sm:mx-auto"
  >
    <template #title>
      <div class="flex flex-col gap-1 px-4 pt-4 sm:pt-5 pr-10">
        <h1 class="text-s-20 font-bold text-black leading-[22px] tracking-[-0.4px]">
          {{ $t('multi_address.rename.title') }}
        </h1>
        <p class="text-s-16 text-[#575757] leading-[22px]">
          {{ $t('multi_address.rename.subtitle') }}
        </p>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 pb-6 pt-6">
        <div class="flex flex-col gap-1">
          <input
            ref="inputRef"
            v-model="draft"
            data-test="rename-modal-input"
            :placeholder="$t('multi_address.rename.placeholder')"
            class="h-12 w-full rounded-[24px] border px-5 text-s-14 text-black outline-none placeholder:text-[#a5a5a5]"
            :class="isDuplicate ? 'border-error' : 'border-[#e6e6e6]'"
            @keyup.enter="save"
          />
          <div
            v-if="isDuplicate"
            data-test="rename-modal-error"
            class="flex items-center gap-1.5 px-1"
          >
            <exclamation-circle-icon class="w-4 h-4 shrink-0 text-error" />
            <p class="text-s-12 text-error leading-[18px]">
              {{ $t('multi_address.rename.duplicate') }}
            </p>
          </div>
        </div>
        <button
          data-test="rename-modal-save"
          class="h-12 w-full rounded-[24px] text-s-16 font-semibold transition-colors"
          :class="isDisabled
            ? 'bg-[#f5f5f5] text-[#767676] cursor-not-allowed'
            : 'bg-primary text-white'"
          :disabled="isDisabled"
          @click="save"
        >
          {{ $t('multi_address.rename.save') }}
        </button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid'
import AppDialog from '@/components/AppDialog.vue'

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
const isDisabled = computed<boolean>(() => !draft.value.trim() || isDuplicate.value)

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
