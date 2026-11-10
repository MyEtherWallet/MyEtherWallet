<script setup lang="ts">
// Preview for the Dropdown design-library component (MEW-2468) at
// /dev/dropdown. Figma: MEW Web App — Design Library › Dropdown (2555:12846) —
// Size × Style × State, plus live single-select, action-menu and flip demos.
import { computed, ref } from 'vue'
import AppDropdown from '@components/dropdown/AppDropdown.vue'
import AppCell from '@components/cell/AppCell.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppDivider from '@components/divider/AppDivider.vue'
import AppIcon from '@components/icon/AppIcon.vue'
import AppTag from '@components/tag/AppTag.vue'
import type { DropdownSize, DropdownSurface } from '@components/dropdown/types'
// Dev-only sample logos, as in the Avatar preview.
import sampleWallet from '@/assets/images/access/ledger.webp'
import sampleCrypto from '@/assets/icons/avatar_samples/crypto.svg'

const SIZES: { size: DropdownSize; title: string }[] = [
  { size: 'm', title: 'Title' },
  { size: 's', title: 'Label' },
]

const SURFACES: { surface: DropdownSurface; label: string; page: string }[] = [
  {
    surface: 'default',
    label: 'on default — white field on the grey page',
    page: 'bg-background-default',
  },
  {
    surface: 'alternative',
    label: 'on alternative — grey field on a white card',
    page: 'bg-background-alternative',
  },
]

// Open has its own section at the top: always open (controlled, never closed)
// and with room below, so it doesn't flip over the grids.
const STATES = [
  { label: 'Default', props: {} },
  { label: 'Hover / Pressed (interact)', props: {} },
  { label: 'Focus (tab into it)', props: {} },
  { label: 'Disabled', props: { disabled: true } },
] as const

const keepOpen = () => {}

const NETWORKS = [
  'Ethereum',
  'Arbitrum',
  'Avalanche',
  'Base',
  'BNB Chain',
  'Optimism',
  'Polygon',
  'Scroll',
  'Sonic',
  'Unichain',
  'zkSync',
  'Linea',
]

const network = ref('Ethereum')
const query = ref('')
const shownNetworks = computed(() =>
  NETWORKS.filter(name =>
    name.toLowerCase().includes(query.value.trim().toLowerCase()),
  ),
)

const ACTIONS = ['Copy address', 'View on explorer', 'Rename', 'Remove']
const lastAction = ref('none')
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Dropdown</h1>
      <p class="text-text-sm text-text-subtle">
        Trigger that opens a Menu List under it. Keyboard: ↓ / Enter / Space
        open and move focus into the menu, Escape closes and returns to the
        trigger, Tab out closes. A mouse open leaves focus on the trigger.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Open</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        <template v-for="s in SIZES" :key="s.size">
          <div
            v-for="surface in SURFACES"
            :key="surface.surface"
            class="flex h-[310px] flex-col gap-2 rounded-12 border border-border-default p-4"
            :class="surface.page"
          >
            <span class="text-text-xs text-text-subtle">
              {{ s.size.toUpperCase() }} · {{ surface.surface }}
            </span>
            <AppDropdown
              :open="true"
              :size="s.size"
              :surface="surface.surface"
              :title="s.title"
              searchable
              @update:open="keepOpen"
            >
              <template #avatar="{ size }">
                <AppAvatar :size="size" type="wallet" :url="sampleWallet" />
              </template>
              <template v-for="index in 3" :key="index">
                <AppCell size="small" inset role="option" title="Title">
                  <template #avatar="{ size: avatarSize }">
                    <AppAvatar
                      :size="avatarSize"
                      type="cryptoAsset"
                      :url="sampleCrypto"
                    />
                  </template>
                  <template #accessory>
                    <span class="flex size-10 items-center justify-center">
                      <AppIcon name="star" size="m" />
                    </span>
                  </template>
                </AppCell>
                <AppDivider v-if="index === 1" aria-hidden="true" />
              </template>
            </AppDropdown>
          </div>
        </template>
      </div>
    </section>

    <section v-for="s in SIZES" :key="s.size" class="flex flex-col gap-6">
      <h2 class="text-label-base">Size {{ s.size.toUpperCase() }}</h2>
      <div
        v-for="surface in SURFACES"
        :key="surface.surface"
        class="flex flex-col gap-3"
      >
        <p class="text-text-xs text-text-subtle">{{ surface.label }}</p>
        <div
          class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 rounded-12 border border-border-default p-4"
          :class="surface.page"
        >
          <div
            v-for="state in STATES"
            :key="state.label"
            class="flex flex-col gap-2"
          >
            <span class="text-text-xs text-text-subtle">{{ state.label }}</span>
            <AppDropdown
              v-bind="state.props"
              :size="s.size"
              :surface="surface.surface"
              :title="s.title"
              searchable
            >
              <template #avatar="{ size }">
                <AppAvatar :size="size" type="wallet" :url="sampleWallet" />
              </template>
              <template v-for="index in 3" :key="index">
                <AppCell size="small" inset role="option" title="Title">
                  <template #avatar="{ size: avatarSize }">
                    <AppAvatar
                      :size="avatarSize"
                      type="cryptoAsset"
                      :url="sampleCrypto"
                    />
                  </template>
                  <template #accessory>
                    <span class="flex size-10 items-center justify-center">
                      <AppIcon name="star" size="m" />
                    </span>
                  </template>
                </AppCell>
                <AppDivider v-if="index === 1" aria-hidden="true" />
              </template>
            </AppDropdown>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div class="flex h-[360px] flex-col gap-3">
        <h2 class="text-label-base">Live listbox with search (M + suffix)</h2>
        <p class="text-text-xs text-text-subtle">picked: {{ network }}</p>
        <AppDropdown
          v-model:search="query"
          class="max-w-75"
          :title="network"
          searchable
          search-placeholder="Search networks"
        >
          <template #avatar="{ size }">
            <AppAvatar :size="size" type="initial" :initial="network[0]" />
          </template>
          <template #suffix>
            <AppTag label="L2" />
          </template>
          <AppCell
            v-for="name in shownNetworks"
            :key="name"
            size="small"
            inset
            role="option"
            :aria-selected="name === network"
            :selected="name === network"
            :title="name"
            @click="network = name"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar :size="avatarSize" type="initial" :initial="name[0]" />
            </template>
          </AppCell>
        </AppDropdown>
      </div>

      <div class="flex h-[360px] flex-col gap-3">
        <h2 class="text-label-base">menuRole="menu": actions (S)</h2>
        <p class="text-text-xs text-text-subtle">
          last action: {{ lastAction }}
        </p>
        <AppDropdown size="s" title="Actions" menu-role="menu">
          <AppCell
            v-for="action in ACTIONS"
            :key="action"
            size="small"
            inset
            role="menuitem"
            :title="action"
            @click="lastAction = action"
          />
        </AppDropdown>
      </div>
    </section>

    <section class="flex flex-col gap-3 pb-8">
      <h2 class="text-label-base">
        Flip: scroll this to the bottom of the window and open it
      </h2>
      <AppDropdown class="max-w-75" title="Opens above when there's no room">
        <AppCell
          v-for="name in NETWORKS.slice(0, 6)"
          :key="name"
          size="small"
          inset
          role="option"
          :title="name"
        />
      </AppDropdown>
    </section>
  </div>
</template>
