<template>
  <div
    class="flex items-center gap-2"
    role="group"
    :aria-label="t('access_wallet.networks.label')"
  >
    <!-- Chips scroll; the "+" stays outside so an added network can't push it out of view. -->
    <div class="flex min-w-0 items-center gap-2 overflow-x-auto no-scrollbar">
      <AppChip
        v-for="chain in pinnedChains"
        :key="chain.name"
        data-testid="network-chip"
        surface="alternative"
        :label="chain.nameLong"
        :selected="chain.name === selected?.name"
        :aria-pressed="chain.name === selected?.name"
        class="shrink-0"
        @click="emit('select', chain)"
      >
        <template #avatar="{ size }">
          <AppAvatar type="network" :size="size" :chain="chain.name" />
        </template>
      </AppChip>
    </div>
    <AppPopUpMenu
      class="shrink-0"
      teleport
      location="left"
      menu-radius-class="rounded-16"
      @update:open="onOpen"
    >
      <template #menu-button="{ toggleMenu }">
        <!-- Once a network is picked from the menu, the "+" becomes a pill showing it
             (selected border while it is the active one) and keeps opening the menu. -->
        <button
          v-if="addedChain"
          type="button"
          data-testid="network-more"
          class="flex h-8 shrink-0 items-center gap-2 rounded-full border bg-background-default pl-1 pr-2 cursor-pointer transition-colors hover:bg-background-default-hover"
          :class="
            addedChain.name === selected?.name
              ? 'border-black'
              : 'border-transparent'
          "
          :aria-label="t('access_wallet.networks.more')"
          aria-haspopup="menu"
          @click="toggleMenu"
        >
          <AppAvatar type="network" size="s" :chain="addedChain.name" />
          <AppIcon name="chevron-down" size="xs" />
        </button>
        <AppBtnIcon
          v-else
          data-testid="network-more"
          variant="filled"
          size="m"
          :label="t('access_wallet.networks.more')"
          class="shrink-0"
          @click="toggleMenu"
        >
          <AppIcon name="plus" size="xs" />
        </AppBtnIcon>
      </template>
      <template #menu-content="{ toggleMenu }">
        <div
          data-testid="network-menu"
          class="flex w-60 max-h-[336px] flex-col gap-1 p-1"
        >
          <AppInput
            v-model="search"
            size="small"
            :label="t('access_wallet.networks.search')"
          >
            <template #leading>
              <AppIcon
                name="magnifying-glass"
                size="s"
                class="text-text-subtle"
              />
            </template>
          </AppInput>
          <ul ref="listRef" class="overflow-y-auto">
            <li v-for="chain in menuChains" :key="chain.name">
              <button
                type="button"
                data-testid="network-option"
                :aria-current="chain.name === selected?.name || undefined"
                class="flex h-12 w-full items-center gap-3 rounded-12 px-3 text-left text-sm hover:bg-background-default-hover cursor-pointer"
                :class="{
                  'bg-background-default': chain.name === selected?.name,
                }"
                @click="pick(chain, toggleMenu)"
              >
                <AppAvatar type="network" size="s" :chain="chain.name" />
                {{ chain.nameLong }}
                <AppIcon
                  v-if="chain.name === selected?.name"
                  name="check-circle"
                  variant="filled"
                  size="s"
                  class="ml-auto shrink-0 text-icon-default"
                />
              </button>
            </li>
          </ul>
          <p
            v-if="!menuChains.length"
            class="px-3 py-4 text-sm text-text-subtle"
          >
            {{ t('access_wallet.networks.not_found') }}
          </p>
        </div>
      </template>
    </AppPopUpMenu>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppChip from '@/components/chip/AppChip.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInput from '@/components/AppInput.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import { useChainsStore } from '@/stores/chainsStore'
import type { Chain } from '@/mew_api/types'

/** Chains always shown as chips; everything else lives in the "+" menu. */
const PINNED_CHAIN_NAMES = ['ETHEREUM', 'BITCOIN', 'BSC']

const props = defineProps<{ selected: Chain | null }>()
const emit = defineEmits<{ select: [chain: Chain] }>()
const { t } = useI18n()
const { chains } = storeToRefs(useChainsStore())

const pinnedChains = computed(() =>
  PINNED_CHAIN_NAMES.map(name =>
    chains.value.find(chain => chain.name === name),
  ).filter((chain): chain is Chain => !!chain),
)
const otherChains = computed(() =>
  chains.value.filter(chain => !PINNED_CHAIN_NAMES.includes(chain.name)),
)
// A network picked from the menu stays in the "+" pill until another one replaces
// it, so switching to a pinned chain and back doesn't make it disappear.
const addedChain = ref<Chain>()
watch(
  () => props.selected?.name,
  name => {
    const extra = otherChains.value.find(chain => chain.name === name)
    if (extra) addedChain.value = extra
  },
  { immediate: true },
)

const search = ref('')
const listRef = ref<HTMLElement | null>(null)
const onOpen = (open: boolean) => {
  search.value = ''
  // Open on the current pick, not at the top of the long list.
  if (open) {
    void nextTick(() =>
      listRef.value
        ?.querySelector('[aria-current="true"]')
        ?.scrollIntoView({ block: 'nearest' }),
    )
  }
}
const menuChains = computed(() => {
  const query = search.value.trim().toLowerCase()
  return query
    ? otherChains.value.filter(chain =>
        chain.nameLong.toLowerCase().includes(query),
      )
    : otherChains.value
})

const pick = (chain: Chain, close: () => void) => {
  emit('select', chain)
  close()
}
</script>
