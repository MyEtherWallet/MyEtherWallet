<template>
  <button
    data-test="listing-card"
    class="flex w-[300px] shrink-0 cursor-pointer flex-col gap-6 overflow-hidden rounded-2xl bg-white p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    @click="$emit('select')"
  >
    <!-- A. Header row -->
    <div class="flex w-full items-center gap-3 justify-start">
      <AppTokenLogo
        :url="logo"
        :symbol="symbol"
        is-stock
        no-shadow
        class="shrink-0"
      />
      <div>
        <AppTokenSymbol
          :symbol="symbol"
          is-stock
          class="shrink-0 !text-s-16 !font-semibold tracking-[-0.32px] text-black"
        />
      </div>

      <div class="ml-auto flex flex-col items-center justify-end">
        <p
          class="min-w-0 flex-1 truncate text-right text-s-16 font-semibold tracking-[-0.32px] text-black ml-auto"
        >
          {{ price }}
        </p>
      </div>

      <button
        type="button"
        :aria-label="$t('common.add_to_watchlist')"
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
      <!-- Description reserves a fixed 3-line block whether present, short, or
           absent, so every card stays the same height regardless of content. -->
      <div
        class="line-clamp-4 h-[86px] leading-5 text-[#575757] text-s-14"
        data-test="listing-description"
      >
        <p
          v-if="name"
          class="min-w-0 flex-1 font-medium text-s-16 leading-5 tracking-[-0.28px] text-black mb-1"
        >
          {{ name }}
        </p>
        {{ description }}
      </div>
    </div>

    <!-- C. Stats row -->
    <div class="flex w-full items-start gap-6">
      <div class="flex min-w-0 flex-1 flex-col">
        <p
          class="text-s-11 uppercase leading-[15px] tracking-[0.6px] text-[#575757]"
        >
          {{ colOneLabel }}
        </p>
        <p
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
        >
          {{ colOne }}
        </p>
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <p
          class="text-s-11 uppercase leading-[15px] tracking-[0.6px] text-[#575757]"
        >
          {{ colTwoLabel }}
        </p>
        <p
          class="text-s-14 font-semibold leading-5 tracking-[-0.28px] text-black"
        >
          {{ colTwo }}
        </p>
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <p
          class="text-s-11 uppercase leading-[15px] tracking-[0.6px] text-[#575757]"
        >
          {{ colThreeLabel }}
        </p>
        <div v-if="colThree != null" class="flex items-center gap-1">
          <p
            class="text-s-12 font-semibold leading-5 tracking-[-0.28px]"
            :class="colThreeColor"
          >
            {{ colThreeText }}
          </p>
          <component
            :is="colThreeArrowIcon"
            class="size-3"
            :class="colThreeColor"
          />
        </div>

        <p v-else>-</p>
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
  </button>
</template>
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
  price?: string
  description?: string
  colOneLabel?: string
  colOne?: string
  colTwoLabel?: string
  colTwo?: string
  colThreeLabel?: string
  // Rendered as a signed percentage with an up/down arrow, unlike the other
  // two stat columns which print their value as given.
  colThree?: number
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

const up = computed(() => (props.colThree ?? 0) >= 0)
const colThreeColor = computed(() => (up.value ? 'text-success' : 'text-error'))
const colThreeArrowIcon = computed(() =>
  up.value ? ArrowUpIcon : ArrowDownIcon,
)
const colThreeText = computed(() =>
  props.colThree != null ? `${Math.abs(props.colThree).toFixed(1)}%` : '',
)
</script>
