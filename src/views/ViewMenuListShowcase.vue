<script setup lang="ts">
// Preview for the Menu List design-library component (MEW-2466) at
// /dev/menu-list. Figma: MEW Web App — Design Library › MenuList (873:4728),
// its showSearchbar / showScrollBar booleans and the row setups it is used with.
import { computed, ref } from 'vue'
import AppMenuList from '@components/menu_list/AppMenuList.vue'
import AppCell from '@components/cell/AppCell.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@components/avatar/AppAvatarBadge.vue'
import AppDivider from '@components/divider/AppDivider.vue'
import AppIcon from '@components/icon/AppIcon.vue'

const NETWORKS = [
  'Ethereum',
  'Arbitrum',
  'Avalanche',
  'Base',
  'Blast',
  'BNB Chain',
  'Celo',
  'Fantom',
  'Gnosis',
  'Linea',
  'Mantle',
  'Moonbeam',
  'Optimism',
  'Polygon',
  'Rootstock',
  'Scroll',
  'Sei',
  'Sonic',
  'Unichain',
  'zkSync',
]

const query = ref('')
const picked = ref('Ethereum')
const shownNetworks = computed(() =>
  NETWORKS.filter(network =>
    network.toLowerCase().includes(query.value.trim().toLowerCase()),
  ),
)

const MENU_ACTIONS = ['Copy address', 'View on explorer', 'Rename', 'Remove']
const lastAction = ref('none')
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Menu List</h1>
      <p class="text-text-sm text-text-subtle">
        Panel of a dropdown: Searchbar, Cell rows, dividers and a scrollbar.
        Keyboard: Tab enters the field, ↓ goes to the rows, ↑/↓ and Home/End
        move between them, ↑ on the first row or typing returns to the field.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Figma default (divider placed by hand)</h2>
      <div
        class="rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppMenuList class="w-75" aria-label="Assets">
          <template v-for="index in 3" :key="index">
            <AppCell size="small" inset title="Title">
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="cryptoAsset"
                  symbol="USDC"
                  badge-bottom
                >
                  <template #badge>
                    <AppAvatarBadge type="network">
                      <span
                        class="size-full rounded-full bg-background-decorative-violet"
                      />
                    </AppAvatarBadge>
                  </template>
                </AppAvatar>
              </template>
              <template #accessory>
                <span class="flex size-10 items-center justify-center">
                  <AppIcon name="star" size="m" />
                </span>
              </template>
            </AppCell>
            <AppDivider v-if="index === 1" aria-hidden="true" />
          </template>
        </AppMenuList>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">
        Live listbox: filtering in the parent, single select
      </h2>
      <p class="text-text-xs text-text-subtle">
        query: "{{ query }}" · picked: {{ picked }}
      </p>
      <div
        class="rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppMenuList
          v-model:search="query"
          class="w-75"
          aria-label="Networks"
          search-placeholder="Search networks"
        >
          <AppCell
            v-for="network in shownNetworks"
            :key="network"
            size="small"
            inset
            role="option"
            :aria-selected="network === picked"
            :selected="network === picked"
            :title="network"
            @click="picked = network"
          >
            <template #avatar="{ size: avatarSize }">
              <AppAvatar
                :size="avatarSize"
                type="initial"
                :initial="network[0]"
              />
            </template>
          </AppCell>
        </AppMenuList>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">divided</h2>
        <div
          class="rounded-12 border border-border-default bg-background-default p-6"
        >
          <AppMenuList divided :searchable="false" aria-label="Divided">
            <AppCell
              v-for="network in NETWORKS.slice(0, 4)"
              :key="network"
              size="small"
              inset
              :title="network"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="initial"
                  :initial="network[0]"
                />
              </template>
            </AppCell>
          </AppMenuList>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">searchable=false</h2>
        <div
          class="rounded-12 border border-border-default bg-background-default p-6"
        >
          <AppMenuList :searchable="false" aria-label="No search">
            <AppCell
              v-for="network in NETWORKS"
              :key="network"
              size="small"
              inset
              :title="network"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="initial"
                  :initial="network[0]"
                />
              </template>
            </AppCell>
          </AppMenuList>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">scrollbar=false</h2>
        <div
          class="rounded-12 border border-border-default bg-background-default p-6"
        >
          <AppMenuList :scrollbar="false" aria-label="No scrollbar">
            <AppCell
              v-for="network in NETWORKS"
              :key="network"
              size="small"
              inset
              :title="network"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="initial"
                  :initial="network[0]"
                />
              </template>
            </AppCell>
          </AppMenuList>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">role="menu": action menu, no search</h2>
      <p class="text-text-xs text-text-subtle">last action: {{ lastAction }}</p>
      <div
        class="rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppMenuList
          class="w-75"
          role="menu"
          :searchable="false"
          aria-label="Account actions"
        >
          <AppCell
            v-for="action in MENU_ACTIONS"
            :key="action"
            size="small"
            inset
            role="menuitem"
            :title="action"
            @click="lastAction = action"
          />
        </AppMenuList>
      </div>
    </section>
  </div>
</template>
