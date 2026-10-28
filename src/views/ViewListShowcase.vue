<script setup lang="ts">
// Preview for the List design-library component (MEW-2467) at /dev/list.
// Figma: MEW Web App — Design Library › List (2287:17344) — its Types, with
// and without the header slot, plus the props Figma only describes.
import { ref } from 'vue'
import AppList from '@components/list/AppList.vue'
import AppCell from '@components/cell/AppCell.vue'
import AppCard from '@components/card/AppCard.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@components/avatar/AppAvatarBadge.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import AppTag from '@components/tag/AppTag.vue'
import type { CellRightAccessory } from '@components/cell/cellSizes'
import type { ListAction } from '@components/list/types'

const BALANCE: CellRightAccessory = {
  kind: 'balance',
  primary: '$1,230',
  secondary: '1,230 USDC',
}

const STAR: ListAction = { icon: 'star', label: 'Add to watchlist' }

const actions = ref(0)
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">List</h1>
      <p class="text-text-sm text-text-subtle">
        Layout of rows (Cell) or cards (Card) with an optional header. Header
        actions: {{ actions }}
      </p>
    </header>

    <section class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">default-title in list</h2>
        <div class="rounded-12 bg-background-default p-6">
          <AppList
            class="max-w-100"
            title="Title"
            header="inside"
            :action="STAR"
            @action="actions++"
          >
            <AppCell
              v-for="index in 7"
              :key="index"
              inset
              title="Title"
              description="Information"
              :right-accessory="BALANCE"
            >
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
            </AppCell>
          </AppList>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">default-title out of list</h2>
        <div class="rounded-12 bg-background-default p-6">
          <AppList
            class="max-w-100"
            title="Title"
            description="Information"
            header="outside"
            :action="STAR"
            @action="actions++"
          >
            <AppCell
              v-for="index in 7"
              :key="index"
              inset
              title="Title"
              description="Information"
              :right-accessory="BALANCE"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar :size="avatarSize" type="initial" initial="U" />
              </template>
            </AppCell>
          </AppList>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">Rows with spacing</h2>
        <div class="rounded-12 bg-background-default p-6">
          <AppList
            class="max-w-100"
            layout="spaced"
            title="Title"
            description="Information"
            header="outside"
            :action="STAR"
            @action="actions++"
          >
            <AppCell
              v-for="index in 7"
              :key="index"
              title="Title"
              description="Information"
              :right-accessory="BALANCE"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar :size="avatarSize" type="initial" initial="U" />
              </template>
            </AppCell>
          </AppList>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">
        Grid (cards) — 1 / 2 / 3 columns at the sm / lg breakpoints
      </h2>
      <div class="rounded-12 bg-background-default p-6">
        <AppList
          layout="grid"
          title="Title"
          description="Information"
          header="outside"
          :action="STAR"
          @action="actions++"
        >
          <AppCard
            v-for="index in 9"
            :key="index"
            title="Title"
            description="Information"
          >
            <template #action>
              <AppBtnIcon icon="star" label="Add to watchlist" />
            </template>
            <div class="h-[110px]" />
            <template #buttons>
              <AppBaseButton
                type="secondary"
                size="medium"
                surface="alternative"
              >
                Button
              </AppBaseButton>
              <AppBaseButton size="medium">Button</AppBaseButton>
            </template>
          </AppCard>
        </AppList>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">
          Header slot (#header-extra) and custom action
        </h2>
        <div class="rounded-12 bg-background-default p-6">
          <AppList class="max-w-100" title="Title" header="inside">
            <template #header-extra>
              <AppTag label="3" />
            </template>
            <template #header-action>
              <AppBtnIcon icon="arrow-path" label="Refresh" />
            </template>
            <AppCell
              v-for="index in 3"
              :key="index"
              inset
              title="Title"
              description="Information"
            />
          </AppList>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-label-base">
          header="none" · surface="alternative" on a white card
        </h2>
        <div
          class="flex flex-col gap-6 rounded-12 bg-background-alternative p-6"
        >
          <AppList class="max-w-100" surface="alternative">
            <AppCell
              v-for="index in 3"
              :key="index"
              inset
              surface="alternative"
              title="Title"
              description="Information"
            />
          </AppList>
        </div>
      </div>
    </section>
  </div>
</template>
