<template>
  <div class="flex min-w-0 flex-col gap-1">
    <span class="text-[11px] leading-4 text-text-subtle">{{
      t('access_wallet.advanced.derivation_path')
    }}</span>
    <!-- Same trigger as AccessDropdown, so it matches the network picker beside it. -->
    <button
      type="button"
      data-testid="path-trigger"
      class="flex h-[52px] w-full items-center gap-2 rounded-16 bg-background-default px-4 text-left cursor-pointer hover:bg-background-default-hover"
      :aria-label="t('access_wallet.advanced.derivation_path')"
      aria-haspopup="dialog"
      @click="openModal"
    >
      <span class="min-w-0 grow truncate">{{ modelValue?.path }}</span>
      <AppIcon name="chevron-down" size="xs" class="shrink-0" />
    </button>

    <!-- Pinned to the top like the access dialog, so the list and the Add form
         grow and shrink downward instead of re-centering the modal. -->
    <AppModal
      v-model="isOpen"
      :title="
        isAdding
          ? t('derivation_path.add_path')
          : t('derivation_path.select_path')
      "
      :show-back-button="isAdding"
      class="self-start mt-[5dvh] max-h-[calc(90dvh-32px)] sm:mt-[10vh] sm:max-h-[calc(80vh-32px)]"
      @back="isAdding = false"
    >
      <!-- Height follows the measured content and animates, like the access
           dialog. The Add form's buttons live in here (not the modal footer)
           so they animate with it. -->
      <div
        class="overflow-clip"
        :style="{
          height: contentHeight > 0 ? `${contentHeight}px` : undefined,
          transition: 'height 400ms cubic-bezier(0.25, 0.1, 0, 1)',
        }"
      >
        <div
          ref="contentRef"
          class="flex flex-col gap-2 px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <template v-if="isAdding">
            <AppInput
              v-model="newLabel"
              surface="alternative"
              :label="t('derivation_path.enter_label')"
              :error-message="labelError"
            />
            <AppInput
              v-model="newPath"
              surface="alternative"
              :label="t('derivation_path.enter_path')"
              :error-message="pathError"
              :submit-disabled="!canAdd"
              @enter="add"
            />
            <AppBtnGroup :has-padding="false" class="mt-2 sm:mt-4">
              <AppBaseButton
                type="secondary"
                surface="alternative"
                data-testid="path-cancel"
                class="w-full"
                @click="isAdding = false"
              >
                {{ t('common.cancel') }}
              </AppBaseButton>
              <AppBaseButton
                surface="alternative"
                data-testid="path-submit"
                class="w-full"
                :disabled="!canAdd"
                @click="add"
              >
                {{ t('common.add') }}
              </AppBaseButton>
            </AppBtnGroup>
          </template>
          <template v-else>
            <div class="flex items-center gap-2">
              <AppInput
                v-model="search"
                size="small"
                surface="alternative"
                :label="t('derivation_path.search')"
                class="grow"
              >
                <template #leading>
                  <AppIcon
                    name="magnifying-glass"
                    size="s"
                    class="text-text-subtle"
                  />
                </template>
              </AppInput>
              <AppBaseButton
                v-if="allowCustom"
                data-testid="path-add"
                size="medium"
                @click="startAdding"
              >
                {{ t('common.add') }}
              </AppBaseButton>
            </div>
            <!-- Only the list scrolls; search and Add stay put above it. -->
            <ul
              class="mew-scrollbar flex max-h-[min(280px,45dvh)] flex-col gap-1 overflow-y-auto"
              role="listbox"
              :aria-label="t('access_wallet.advanced.derivation_path')"
            >
              <li v-for="path in filtered" :key="`${path.label}:${path.path}`">
                <button
                  type="button"
                  role="option"
                  data-testid="path-option"
                  class="flex min-h-[54px] w-full items-center gap-3 rounded-12 px-3 text-left text-sm cursor-pointer hover:bg-background-default-hover"
                  :class="{ 'bg-background-default': isSelected(path) }"
                  :aria-selected="isSelected(path)"
                  @click="pick(path)"
                >
                  <span class="min-w-0 grow font-semibold">{{
                    path.label
                  }}</span>
                  <span class="shrink-0 text-text-subtle">{{ path.path }}</span>
                  <AppIcon
                    v-if="isSelected(path)"
                    name="check-circle"
                    variant="filled"
                    size="s"
                    class="shrink-0 text-icon-default"
                  />
                </button>
              </li>
            </ul>
            <p
              v-if="!filtered.length"
              class="px-3 py-4 text-sm text-text-subtle"
            >
              {{ t('access_wallet.advanced.no_paths') }}
            </p>
          </template>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="T extends Pick<DerivationPath, 'label' | 'path'>"
>
/**
 * Derivation path picker: a dropdown-style trigger that opens a modal with a
 * searchable path list and, when `allowCustom` is set, an Add form for a
 * labelled custom path. The parent stores the new path (it knows the chain
 * type) from the `add` event.
 */
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResizeObserver } from '@vueuse/core'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInput from '@/components/AppInput.vue'
import AppModal from '@/components/modal/AppModal.vue'
import { checkCustomPath } from '@/utils/customPathHelpers'
import type { DerivationPath } from '../common/configs/configPaths'

const props = defineProps<{
  paths: T[]
  modelValue?: T
  allowCustom?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [path: T]
  add: [path: Pick<DerivationPath, 'label' | 'path'>]
}>()

const { t } = useI18n()

const isOpen = ref(false)
const isAdding = ref(false)
const search = ref('')
const newLabel = ref('')
const newPath = ref('')
const labelError = ref('')
const pathError = ref('')

/** Measured content height, animated by the wrapper in the modal body. */
const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(0)
useResizeObserver(contentRef, () => {
  contentHeight.value = contentRef.value?.offsetHeight ?? 0
})

const openModal = () => {
  isAdding.value = false
  search.value = ''
  // Measure fresh, so it doesn't animate from where it was last closed.
  contentHeight.value = 0
  isOpen.value = true
}

// A fresh form each time, so a cancelled draft doesn't come back.
const startAdding = () => {
  newLabel.value = ''
  newPath.value = ''
  isAdding.value = true
}

const isSelected = (path: T) =>
  props.modelValue?.label === path.label && props.modelValue?.path === path.path

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return query
    ? props.paths.filter(path =>
        `${path.label} ${path.path}`.toLowerCase().includes(query),
      )
    : props.paths
})

const pick = (path: T) => {
  emit('update:modelValue', path)
  isOpen.value = false
}

watch(newLabel, () => (labelError.value = ''))
watch(newPath, () => (pathError.value = ''))

const canAdd = computed(() => !!newLabel.value.trim() && !!newPath.value.trim())

const add = () => {
  const label = newLabel.value.trim()
  const path = newPath.value.trim()
  const taken = props.paths.some(
    existing => existing.label.toLowerCase() === label.toLowerCase(),
  )
  labelError.value = taken ? t('derivation_path.label_exists') : ''
  pathError.value = checkCustomPath(path)
    ? ''
    : t('derivation_path.invalid_path')
  if (labelError.value || pathError.value) return
  emit('add', { label, path })
  isOpen.value = false
}
</script>
