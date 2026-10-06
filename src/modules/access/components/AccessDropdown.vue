<template>
  <div class="flex min-w-0 flex-col gap-1">
    <span class="text-[11px] leading-4 text-text-subtle">{{ label }}</span>
    <AppPopUpMenu
      teleport
      location="left"
      menu-radius-class="rounded-16"
      @update:open="onOpen"
    >
      <template #menu-button="{ toggleMenu }">
        <button
          type="button"
          data-testid="dropdown-trigger"
          class="flex h-[52px] w-full items-center gap-2 rounded-16 bg-background-default px-4 text-left cursor-pointer hover:bg-background-default-hover"
          :aria-label="label"
          aria-haspopup="listbox"
          :aria-expanded="isOpen"
          @click="toggleMenu"
        >
          <span class="flex min-w-0 grow items-center gap-2 truncate">
            <slot name="selected" :item="modelValue" />
          </span>
          <AppIcon
            name="chevron-down"
            size="xs"
            class="shrink-0 transition-transform"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
      </template>
      <template #menu-content="{ toggleMenu }">
        <div
          data-testid="dropdown-menu"
          class="flex w-[300px] max-h-[380px] flex-col gap-1 p-1"
        >
          <AppInput v-model="search" size="small" :label="searchPlaceholder">
            <template #leading>
              <AppIcon
                name="magnifying-glass"
                size="s"
                class="text-text-subtle"
              />
            </template>
          </AppInput>
          <ul
            ref="listRef"
            class="overflow-y-auto"
            role="listbox"
            :aria-label="label"
          >
            <li v-for="item in filtered" :key="itemKey(item)">
              <button
                type="button"
                role="option"
                data-testid="dropdown-option"
                class="flex min-h-[54px] w-full items-center gap-3 rounded-12 px-3 text-left cursor-pointer hover:bg-background-default-hover"
                :class="{ 'bg-background-default': isSelected(item) }"
                :aria-selected="isSelected(item)"
                @click="pick(item, toggleMenu)"
              >
                <slot name="item" :item="item" />
                <AppIcon
                  v-if="isSelected(item)"
                  name="check"
                  size="xs"
                  class="ml-auto shrink-0 text-text-brand"
                />
              </button>
            </li>
          </ul>
          <p v-if="!filtered.length" class="px-3 py-4 text-sm text-text-subtle">
            {{ emptyText }}
          </p>
        </div>
      </template>
    </AppPopUpMenu>
  </div>
</template>

<script setup lang="ts" generic="T">
/**
 * Local stand-in for the design-library Dropdown M + MenuList (not built yet):
 * a labelled trigger that opens a searchable list. Swap for the DS pair later.
 */
import { computed, nextTick, ref } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInput from '@/components/AppInput.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'

const props = defineProps<{
  label: string
  items: T[]
  modelValue?: T
  searchPlaceholder: string
  emptyText: string
  itemKey: (item: T) => string
  /** Text the search box matches against (case-insensitive contains). */
  searchText: (item: T) => string
}>()
const emit = defineEmits<{ 'update:modelValue': [item: T] }>()

const isOpen = ref(false)
const search = ref('')
const listRef = ref<HTMLElement | null>(null)
const onOpen = (open: boolean) => {
  isOpen.value = open
  search.value = ''
  // Long lists (networks): open on the current pick, not at the top.
  if (open) {
    void nextTick(() =>
      listRef.value
        ?.querySelector('[aria-selected="true"]')
        ?.scrollIntoView({ block: 'nearest' }),
    )
  }
}

const isSelected = (item: T) =>
  !!props.modelValue && props.itemKey(item) === props.itemKey(props.modelValue)

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return query
    ? props.items.filter(item =>
        props.searchText(item).toLowerCase().includes(query),
      )
    : props.items
})

const pick = (item: T, close: () => void) => {
  emit('update:modelValue', item)
  close()
}
</script>
