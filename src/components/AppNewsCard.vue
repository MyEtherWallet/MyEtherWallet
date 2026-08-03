<script setup lang="ts">
import { computed } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'

const props = defineProps<{
  title: string
  source?: string
  /** Pre-formatted date label (e.g. "Yesterday", "Jul 15 2026"). */
  date?: string
  description?: string
  /** Related asset symbol shown as a token badge (e.g. "AAPL"). */
  ticker?: string
  href?: string
  timestamp?: string | number
}>()

// Fall back to a locale date when no pre-formatted `date` is passed (keeps the
// component usable from a raw timestamp, e.g. in unit tests).
const dateLabel = computed(
  () =>
    props.date ||
    (props.timestamp ? new Date(props.timestamp).toLocaleDateString() : ''),
)
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    data-test="news-card"
    class="group relative flex h-[280px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-6"
  >
    <div class="flex w-full flex-col gap-2">
      <div class="flex items-center gap-1 text-s-14 leading-5 text-[#575757]">
        <span v-if="source">{{ source }}</span>
        <span v-if="source && dateLabel">•</span>
        <span v-if="dateLabel" data-test="news-date">{{ dateLabel }}</span>
      </div>
      <p
        data-test="news-title"
        class="line-clamp-2 w-full text-[18px] font-semibold capitalize leading-6 tracking-[-0.36px] text-black group-hover:text-primary group-hover:underline"
      >
        {{ title }}
      </p>
      <p
        v-if="description"
        class="line-clamp-3 w-full text-s-16 leading-[22px] text-[#575757] group-hover:text-black"
      >
        {{ description }}
      </p>
    </div>

    <div v-if="ticker" class="flex items-center gap-2">
      <AppTokenLogo :symbol="ticker" :is-stock="true" width="w-6" height="h-6" />
      <AppTokenSymbol
        :symbol="ticker"
        :is-stock="true"
        class="!text-s-14 !font-normal !text-[#575757]"
      />
    </div>

    <ArrowTopRightOnSquareIcon
      class="absolute right-6 top-6 size-5 text-[#575757] opacity-0 transition-opacity group-hover:opacity-100"
    />
  </a>
</template>
