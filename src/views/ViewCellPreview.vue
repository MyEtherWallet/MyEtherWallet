<script setup lang="ts">
import { ref } from 'vue'
import { StarIcon } from '@heroicons/vue/24/outline'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import AppCell from '@components/AppCell.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { CELL_SIZES } from '@components/cellSizes'

const variants = [
  {
    key: 'surface',
    label: 'variant="surface" (Figma Style=Default)',
    bg: 'bg-bgBase',
  },
  {
    key: 'base',
    label: 'variant="base" (Figma Style=Alternative)',
    bg: 'bg-white',
  },
] as const

const states = [
  { label: 'Default', props: {} },
  { label: 'Hover / Pressed (interact)', props: {} },
  { label: 'Selected', props: { selected: true } },
  { label: 'Focus (tab into it)', props: {} },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading', props: { loading: true } },
] as const

const clicks = ref(0)
const prefixClicks = ref(0)
</script>

<template>
  <div class="min-h-screen bg-appBackground p-10">
    <h1 class="title5 mb-2">AppCell — variant × state × size</h1>
    <p class="mb-8 text-s-14 text-t-subtle">
      Cell clicks: {{ clicks }} · prefix clicks: {{ prefixClicks }}
    </p>

    <div
      v-for="variant in variants"
      :key="variant.key"
      class="mb-10 border-b border-grey-10 pb-8"
    >
      <h2 class="text7 mb-4">{{ variant.label }}</h2>

      <div :class="['grid grid-cols-2 gap-6 rounded-16 p-6', variant.bg]">
        <div v-for="size in CELL_SIZES" :key="size" class="flex flex-col gap-3">
          <p class="text-s-13 capitalize text-grey-50">size="{{ size }}"</p>
          <div
            v-for="state in states"
            :key="state.label"
            class="flex flex-col gap-1"
          >
            <span class="text-s-12 text-grey-50">{{ state.label }}</span>
            <AppCell
              :variant="variant.key"
              :size="size"
              v-bind="state.props"
              title="Title"
              description="Information"
              @click="clicks++"
            >
              <template #avatar>
                <span class="size-full bg-primary" />
              </template>
              <template #avatarBadge>
                <span class="size-full bg-violet" />
              </template>
              <template #accessory>
                <p
                  class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
                >
                  $1,230
                </p>
                <p class="text-s-14 leading-5 text-t-subtle">1,230 USDC</p>
              </template>
            </AppCell>
          </div>
        </div>
      </div>
    </div>

    <h2 class="text7 mb-4">Slots</h2>
    <div class="flex max-w-[480px] flex-col gap-3 rounded-16 bg-bgBase p-6">
      <AppCell
        title="Prefix action"
        description="Watchlist star"
        @click="clicks++"
      >
        <template #prefix>
          <AppBtnIcon label="Watchlist" @click="prefixClicks++">
            <StarIcon class="size-4" />
          </AppBtnIcon>
        </template>
        <template #avatar>
          <span class="size-full bg-primary" />
        </template>
      </AppCell>

      <AppCell
        title="Inline button"
        description="Action slot"
        @click="clicks++"
      >
        <template #avatar>
          <span class="size-full bg-primary" />
        </template>
        <template #action>
          <AppBaseButton size="small" @click="prefixClicks++"
            >Button</AppBaseButton
          >
        </template>
      </AppCell>

      <AppCell
        title="Suffix action"
        description="Overflow menu"
        @click="clicks++"
      >
        <template #avatar>
          <span class="size-full bg-primary" />
        </template>
        <template #suffix>
          <AppBtnIcon label="More" @click="prefixClicks++">
            <EllipsisHorizontalIcon class="size-[18px]" />
          </AppBtnIcon>
        </template>
      </AppCell>

      <AppCell title="No avatar" description="Text only" @click="clicks++" />

      <AppCell
        title="Static row"
        description="interactive=false — no hover, no cursor"
        :interactive="false"
      >
        <template #avatar>
          <span class="size-full bg-primary" />
        </template>
      </AppCell>

      <AppCell
        title="Very long title that should truncate instead of wrapping onto a second line"
        description="Very long description that should truncate instead of wrapping onto a second line"
      >
        <template #avatar>
          <span class="size-full bg-primary" />
        </template>
        <template #accessory>
          <p
            class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
          >
            $1,230
          </p>
        </template>
      </AppCell>
    </div>
  </div>
</template>
