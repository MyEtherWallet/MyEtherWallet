<script setup lang="ts">
// Preview for the Cell design-library component (MEW-2195) at /dev/cell.
// Figma: MEW Web App — Design Library › Cell — Style × State × Size, each
// style on the surface it is meant for, plus one row per slot.
import { ref } from 'vue'
import AppCell from '@components/AppCell.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@components/avatar/AppAvatarBadge.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import AppIcon from '@components/icon/AppIcon.vue'
import { CELL_SIZES, type CellSurface } from '@components/cellSizes'

const SURFACES: { surface: CellSurface; label: string; page: string }[] = [
  {
    surface: 'default',
    label: 'Style: Default — white cell on the grey page',
    page: 'bg-background-default',
  },
  {
    surface: 'alternative',
    label: 'Style: Alternative — grey cell on a white card',
    page: 'bg-background-alternative',
  },
]

const STATES = [
  { label: 'Default', props: {} },
  { label: 'Hover / Pressed (interact)', props: {} },
  { label: 'Selected', props: { selected: true } },
  { label: 'Focus (tab into it)', props: {} },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading', props: { loading: true } },
] as const

const clicks = ref(0)
const slotClicks = ref(0)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Cell</h1>
      <p class="text-text-sm text-text-subtle">
        List row composed from Avatar, Avatar badge and Content Group. Cell
        clicks: {{ clicks }} · slot clicks: {{ slotClicks }}
      </p>
    </header>

    <section v-for="s in SURFACES" :key="s.surface" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ s.label }}</h2>
      <div
        class="grid grid-cols-2 gap-6 rounded-12 border border-border-default p-6"
        :class="s.page"
      >
        <div v-for="size in CELL_SIZES" :key="size" class="flex flex-col gap-3">
          <p class="text-text-xs text-text-subtle">size="{{ size }}"</p>
          <div
            v-for="state in STATES"
            :key="state.label"
            class="flex flex-col gap-1"
          >
            <span class="text-text-xs text-text-subtle">{{ state.label }}</span>
            <AppCell
              :surface="s.surface"
              :size="size"
              v-bind="state.props"
              title="Title"
              description="Information"
              accessory-title="$1,230"
              accessory-description="1,230 USDC"
              @click="clicks++"
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
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Slots</h2>
      <div
        class="flex max-w-[480px] flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppCell
          title="Prefix action"
          description="Watchlist star"
          @click="clicks++"
        >
          <template #prefix>
            <AppBtnIcon label="Watchlist" @click="slotClicks++">
              <AppIcon name="star" size="xxs" />
            </AppBtnIcon>
          </template>
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="W" />
          </template>
        </AppCell>

        <AppCell
          title="Inline button"
          description="Action slot"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="B" />
          </template>
          <template #action>
            <AppBaseButton size="small" @click="slotClicks++">
              Button
            </AppBaseButton>
          </template>
        </AppCell>

        <AppCell
          title="Suffix action"
          description="Overflow menu"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="S" />
          </template>
          <template #suffix>
            <AppBtnIcon label="More" @click="slotClicks++">
              <AppIcon name="ellipsis-horizontal" size="xs" variant="filled" />
            </AppBtnIcon>
          </template>
        </AppCell>

        <AppCell title="No avatar" description="Text only" @click="clicks++" />

        <AppCell
          title="Custom accessory slot"
          description="Coloured 24h change"
          accessory-title="$1,230"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="C" />
          </template>
          <template #accessory>
            <p class="text-label-base text-text-default">$1,230</p>
            <p class="text-text-sm text-text-success">+2.45%</p>
          </template>
        </AppCell>

        <AppCell
          title="Static row"
          description="interactive=false — no hover, no cursor"
          :interactive="false"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="R" />
          </template>
        </AppCell>

        <AppCell
          title="Very long title that should truncate instead of wrapping onto a second line"
          description="Very long description that should truncate instead of wrapping onto a second line"
          accessory-title="$1,230"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="L" />
          </template>
        </AppCell>
      </div>
    </section>
  </div>
</template>
