<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    title: string
    highlight?: string
    category?: string
    icon?: Component
    gradient?: 'purple' | 'blue' | 'green'
    to?: RouteLocationRaw
  }>(),
  { gradient: 'purple' },
)

const tag = computed(() => (props.to ? 'RouterLink' : 'div'))
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    data-test="rewards-card"
    class="group relative flex h-[230px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-white p-5"
  >
    <!-- decorative gradient blob (per-card variant) -->
    <span
      aria-hidden="true"
      :data-gradient="props.gradient"
      class="rewards-gradient pointer-events-none absolute -right-16 -top-24 size-[340px]"
      :class="`rewards-gradient--${props.gradient}`"
    />

    <!-- category chip -->
    <div v-if="category || icon" class="relative flex items-center gap-2">
      <component :is="icon" v-if="icon" class="size-8 shrink-0 text-primary" />
      <span
        v-if="category"
        data-test="rewards-category"
        class="text-s-12 font-semibold tracking-[-0.24px] text-primary"
        >{{ category }}</span
      >
    </div>

    <!-- headline + chevron -->
    <div class="relative flex items-end gap-4">
      <div
        class="flex min-w-0 flex-1 flex-col gap-1 text-s-28 font-bold leading-8 tracking-[-0.84px]"
      >
        <p data-test="rewards-title" class="text-black">{{ title }}</p>
        <p v-if="highlight" data-test="rewards-highlight" class="text-primary">
          {{ highlight }}
        </p>
      </div>
      <span
        class="flex shrink-0 items-center rounded-full p-2 transition-colors group-hover:bg-grey-5"
      >
        <ChevronRightIcon class="size-6 text-primary" />
      </span>
    </div>
  </component>
</template>

<style scoped>
.rewards-gradient {
  border-radius: 9999px;
  filter: blur(32px);
  opacity: 0.9;
}
.rewards-gradient--purple {
  background: radial-gradient(
    closest-side at 55% 40%,
    #f0b8e8 0%,
    #c7b5ff 32%,
    #b9ccff 55%,
    #c4ecff 72%,
    transparent 85%
  );
}
.rewards-gradient--blue {
  background: radial-gradient(
    closest-side at 55% 40%,
    #9ad4ff 0%,
    #a8c6ff 40%,
    #cfe6ff 66%,
    transparent 84%
  );
}
.rewards-gradient--green {
  background: radial-gradient(
    closest-side at 58% 45%,
    #7fe6a6 0%,
    #c3ef7e 42%,
    #b6ecc4 68%,
    transparent 85%
  );
}
</style>
