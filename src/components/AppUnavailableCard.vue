<template>
  <div
    role="alert"
    class="w-full max-w-[380px] mx-auto p-6 bg-white border border-grey-10 rounded-16"
  >
    <div class="flex justify-center">
      <slot name="icon">
        <exclamation-circle-icon
          :class="['w-12 h-12', accentClass]"
          aria-hidden="true"
        />
      </slot>
    </div>

    <p :class="['mt-6 text-s-16 font-semibold text-center', accentClass]">
      {{ title }}
    </p>
    <p v-if="description" class="text-s-12 text-info text-center">
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-8 flex flex-col items-center">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    /**
     * Colors the icon and title only — the shell stays neutral.
     * `error` for states the user cannot resolve here (jurisdiction blocks,
     * unsupported networks); `primary` for informational states that resolve
     * on their own, such as a market closed until a known reopen time.
     */
    accent?: 'error' | 'primary'
  }>(),
  { accent: 'error' },
)

const accentClass = computed(() =>
  props.accent === 'primary' ? 'text-primary' : 'text-error',
)
</script>
