<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
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
  /** Resolved icon URL for `ticker`; falls back to initials when absent. */
  tokenLogo?: string
  /** In-app route for the ticker badge (e.g. the stock page); when absent the
   * badge is a plain, non-clickable label. */
  tokenTo?: RouteLocationRaw
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
  <!--
    Stretched-link card: the container is the positioned context, the title's
    `::after` overlay makes the whole card open the article, and the ticker badge
    sits above it (relative z-10) so it can be its own link to the stock page
    without nesting one <a> inside another.
  -->
  <div
    data-test="news-card"
    class="group relative isolate flex h-[280px] flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-white p-6"
  >
    <div class="flex w-full min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <div class="flex items-center gap-1 text-s-14 leading-5 text-[#575757]">
        <span v-if="source">{{ source }}</span>
        <span v-if="source && dateLabel">•</span>
        <span v-if="dateLabel" data-test="news-date">{{ dateLabel }}</span>
      </div>
      <a
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        data-test="news-title"
        class="line-clamp-3 w-full text-[18px] font-semibold capitalize leading-6 tracking-[-0.36px] text-black after:absolute after:inset-0 group-hover:text-primary group-hover:underline"
      >
        {{ title }}
      </a>
      <p
        v-if="description"
        class="line-clamp-3 w-full text-s-16 leading-[22px] text-[#575757] group-hover:text-black"
      >
        {{ description }}
      </p>
    </div>

    <component
      :is="tokenTo ? RouterLink : 'div'"
      v-if="ticker"
      :to="tokenTo"
      data-test="news-ticker"
      class="flex w-fit shrink-0 items-center gap-2"
      :class="tokenTo ? 'relative z-10 transition-opacity hover:opacity-80' : ''"
    >
      <AppTokenLogo
        :symbol="ticker"
        :url="tokenLogo"
        :is-stock="true"
        width="w-6"
        height="h-6"
      />
      <AppTokenSymbol
        :symbol="ticker"
        :is-stock="true"
        class="!text-s-14 !font-normal !text-[#575757]"
      />
    </component>

    <ArrowTopRightOnSquareIcon
      class="pointer-events-none absolute right-6 top-6 size-5 text-[#575757] opacity-0 transition-opacity group-hover:opacity-100"
    />
  </div>
</template>
