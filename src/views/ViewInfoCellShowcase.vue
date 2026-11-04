<script setup lang="ts">
// Preview for the InfoCell design-library component (MEW-2464) at
// /dev/info-cell. Matches Figma component set 2656:30288 (Style × Size ×
// Loading), each style on the surface it is meant for, plus one row per toggle.
import { ref } from 'vue'
import AppInfoCell from '@components/cell/AppInfoCell.vue'
import AppAvatar from '@components/avatar/AppAvatar.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import AppCellWatchlistToggle from '@components/cell/AppCellWatchlistToggle.vue'
import AppIcon from '@components/icon/AppIcon.vue'
import { CELL_SIZES, type CellSurface } from '@components/cell/cellSizes'
import ethIcon from '@/assets/icons/tokens/eth.svg'

const SURFACES: { surface: CellSurface; label: string; page: string }[] = [
  {
    surface: 'default',
    label: 'Style: default — white row on the grey page',
    page: 'bg-background-default',
  },
  {
    surface: 'alternative',
    label: 'Style: alternative — grey row on a white card',
    page: 'bg-background-alternative',
  },
]

const OPTIONS = ['Ethereum', 'Bitcoin', 'Solana'] as const
type Option = (typeof OPTIONS)[number]
const checked = ref<Option[]>(['Ethereum'])
const toggleChecked = (option: Option) => {
  checked.value = checked.value.includes(option)
    ? checked.value.filter(item => item !== option)
    : [...checked.value, option]
}
const picked = ref<Option>('Ethereum')

const watched = ref(false)
const isLoading = ref(true)
const clicks = ref(0)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">InfoCell</h1>
      <p class="text-text-sm text-text-subtle">
        Richer variant of Cell that supports a checkbox/radio prefix and
        skeleton loading state, used for selectable asset rows. Row clicks:
        {{ clicks }}
      </p>
    </header>

    <section v-for="s in SURFACES" :key="s.surface" class="flex flex-col gap-4">
      <h2 class="text-label-base">{{ s.label }}</h2>
      <div
        class="grid gap-6 rounded-12 border border-border-default p-6 md:grid-cols-2"
        :class="s.page"
      >
        <div v-for="size in CELL_SIZES" :key="size" class="flex flex-col gap-3">
          <p class="text-text-xs text-text-subtle">size="{{ size }}"</p>
          <template v-for="loading in [false, true]" :key="String(loading)">
            <p class="text-text-xs text-text-subtle">loading: {{ loading }}</p>
            <AppInfoCell
              :surface="s.surface"
              :size="size"
              :loading="loading"
              title="Title"
              description="Information"
              trailing-title="Title"
              trailing-description="Information"
            >
              <template #avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="cryptoAsset"
                  symbol="ETH"
                  :url="ethIcon"
                />
              </template>
              <template #trailing-avatar="{ size: avatarSize }">
                <AppAvatar
                  :size="avatarSize"
                  type="cryptoAsset"
                  symbol="ETH"
                  :url="ethIcon"
                />
              </template>
            </AppInfoCell>
          </template>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Toggles</h2>
      <div
        class="flex max-w-120 flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppInfoCell
          v-for="option in OPTIONS"
          :key="`checkbox-${option}`"
          :title="option"
          description="Checkbox — tap the row"
          trailing-title="$1,230"
          trailing-description="1.2 ETH"
          checkbox
          :selected="checked.includes(option)"
          @click="toggleChecked(option)"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" :initial="option[0]" />
          </template>
        </AppInfoCell>

        <AppInfoCell
          v-for="option in OPTIONS"
          :key="`radio-${option}`"
          :title="option"
          description="Radio — tap the row"
          trailing-title="$1,230"
          trailing-description="1.2 ETH"
          radio
          :selected="picked === option"
          @click="picked = option"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" :initial="option[0]" />
          </template>
        </AppInfoCell>

        <AppInfoCell
          title="Prefix action"
          description="Watchlist toggle"
          trailing-title="$1,230"
          @click="clicks++"
        >
          <template #prefix>
            <AppCellWatchlistToggle v-model="watched" />
          </template>
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="W" />
          </template>
        </AppInfoCell>

        <AppInfoCell
          title="Right accessory swap"
          description="Balance + performance"
          :right-accessory="{
            kind: 'balance-performance',
            primary: '$1,230',
            change: 2.45,
          }"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="R" />
          </template>
        </AppInfoCell>

        <AppInfoCell
          title="Button"
          description="Inline action"
          trailing-title="$1,230"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="B" />
          </template>
          <template #action>
            <AppBaseButton type="secondary" size="small">Button</AppBaseButton>
          </template>
        </AppInfoCell>

        <AppInfoCell
          title="Suffix action"
          description="Overflow menu"
          trailing-title="$1,230"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="S" />
          </template>
          <template #suffix>
            <AppBtnIcon size="s" icon="ellipsis-horizontal" label="More" />
          </template>
        </AppInfoCell>

        <AppInfoCell
          title="Additional content"
          description="Extra slot"
          trailing-title="$1,230"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="A" />
          </template>
          <template #extra>
            <AppIcon name="chevron-right" size="s" />
          </template>
        </AppInfoCell>

        <AppInfoCell
          title="No trailing avatar"
          description="Avatar only on the left"
          trailing-title="$1,230"
          trailing-description="1.2 ETH"
          @click="clicks++"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar :size="avatarSize" type="initial" initial="N" />
          </template>
        </AppInfoCell>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Loading → loaded</h2>
      <div
        class="flex max-w-120 flex-col gap-3 rounded-12 border border-border-default bg-background-default p-6"
      >
        <AppBaseButton
          size="small"
          class="self-start"
          @click="isLoading = !isLoading"
        >
          {{ isLoading ? 'Load' : 'Reset' }}
        </AppBaseButton>
        <AppInfoCell
          :loading="isLoading"
          title="Ethereum"
          description="ETH"
          trailing-title="$3,120.40"
          trailing-description="1.0 ETH"
        >
          <template #avatar="{ size: avatarSize }">
            <AppAvatar
              :size="avatarSize"
              type="cryptoAsset"
              symbol="ETH"
              :url="ethIcon"
            />
          </template>
          <template #trailing-avatar="{ size: avatarSize }">
            <AppAvatar
              :size="avatarSize"
              type="cryptoAsset"
              symbol="ETH"
              :url="ethIcon"
            />
          </template>
        </AppInfoCell>
      </div>
    </section>
  </div>
</template>
