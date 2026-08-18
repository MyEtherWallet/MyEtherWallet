<script setup lang="ts">
import { computed } from 'vue'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/20/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/16/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'

interface Props {
  logo?: string
  symbol: string
  name?: string
  isStock?: boolean
  price?: string
  description?: string
  marketCapLabel?: string
  marketCap?: string
  changeLabel?: string
  change?: number
  volumeLabel?: string
  volume?: string
  favorite?: boolean
  tradeLabel?: string
  /** Renders the CTA disabled (e.g. crypto coin with no swap/bridge path) so
   *  the card keeps a button instead of an empty gap. */
  tradeDisabled?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  select: []
  trade: []
  'toggle-favorite': []
}>()

const up = computed(() => (props.change ?? 0) >= 0)
const changeColor = computed(() => (up.value ? 'text-success' : 'text-error'))
const changeArrowIcon = computed(() => (up.value ? ArrowUpIcon : ArrowDownIcon))
const changeText = computed(() =>
  props.change != null ? `${Math.abs(props.change).toFixed(1)}%` : '',
)
</script>

<template>
  <div
    data-test="listing-card"
    class="flex w-[300px] shrink-0 cursor-pointer flex-col gap-6 overflow-hidden rounded-2xl bg-white p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    @click="$emit('select')"
  >
    <!-- A. Header row -->
    <div class="flex w-full items-center gap-2">
      <AppTokenLogo
        :url="logo"
        :symbol="symbol"
        :is-stock="isStock"
        width="size-10"
        height="size-10"
        no-shadow
        no-ring
        class="shrink-0"
      />
      <p
        class="min-w-0 flex-1 truncate text-right text-s-16 font-semibold tracking-[-0.32px] text-black"
      >
        {{ price }}
      </p>
      <button
        type="button"
        data-test="listing-favorite"
        class="hoverNoBG flex size-8 shrink-0 items-center justify-center rounded-full"
        @click.stop="$emit('toggle-favorite')"
      >
        <StarSolidIcon v-if="favorite" class="size-5 text-primary" />
        <StarOutlineIcon v-else class="size-5 text-[#575757]" />
      </button>
    </div>

    <!-- B. Name block -->
    <div class="flex w-full flex-col gap-1">
      <div class="flex w-full items-baseline gap-1 text-s-16">
        <AppTokenSymbol
          :symbol="symbol"
          :is-stock="isStock"
          class="shrink-0 !text-s-16 !font-semibold tracking-[-0.32px] text-black"
        />
        <span v-if="name" class="min-w-0 flex-1 truncate text-[#575757]">{{
          name
        }}</span>
      </div>
      <!-- Description reserves a fixed 3-line block whether present, short, or
           absent, so every card stays the same height regardless of content. -->
      <p
        class="line-clamp-3 h-[60px] text-s-14 leading-5 text-[#575757]"
        data-test="listing-description"
      >
        {{ description }}
      </p>
    </div>

    <!-- C. Stats row -->
    <div class="flex w-full items-start gap-6">
      <div class="flex min-w-0 flex-1 flex-col">
        <p
          class="text-s-11 uppercase leading-[15px] tracking-[0.6px] text-[#575757]"
        >
          {{ marketCapLabel }}
        </p>
        <p
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
        >
          {{ marketCap }}
        </p>
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <p
          class="text-s-11 uppercase leading-[15px] tracking-[0.6px] text-[#575757]"
        >
          {{ changeLabel }}
        </p>
        <div v-if="change != null" class="flex items-center gap-1">
          <p
            class="text-s-14 font-semibold leading-5 tracking-[-0.28px]"
            :class="changeColor"
          >
            {{ changeText }}
          </p>
          <component
            :is="changeArrowIcon"
            class="size-4"
            :class="changeColor"
          />
        </div>
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <p
          class="text-s-11 uppercase leading-[15px] tracking-[0.6px] text-[#575757]"
        >
          {{ volumeLabel }}
        </p>
        <p
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
        >
          {{ volume }}
        </p>
      </div>
    </div>

    <!-- D. Trade button. Always rendered (disabled when the listing has no
         swap/bridge path) so every card keeps the same height with no gap. -->
    <button
      v-if="tradeLabel"
      type="button"
      data-test="listing-trade"
      :disabled="tradeDisabled"
      class="flex h-10 w-full items-center justify-center rounded-3xl bg-grey-5 text-s-14 font-semibold tracking-[-0.28px] text-primary transition-colors hover:bg-grey-10 disabled:cursor-not-allowed disabled:text-[#a5a5a5] disabled:hover:bg-grey-5"
      @click.stop="$emit('trade')"
    >
      {{ tradeLabel }}
    </button>
    <div v-else class="h-10 w-full" aria-hidden="true" />
  </div>
</template>
