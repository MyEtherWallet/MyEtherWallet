<template>
  <!--
    Only rendered while `/status` answers with a server error. A 200 and a 429
    both mean the service is answering, and the unknown state (first paint, or a
    request that never got a response) reads the same way, so the page never
    opens with an outage notice it cannot substantiate.
  -->
  <div
    v-if="showBanner"
    role="status"
    class="flex items-center gap-2 w-full px-4 py-3 rounded-16 bg-warning-10 border-1 border-warning-10"
  >
    <!--
      The amber lives in the tinted shell and the icon rather than the text:
      `warning` is rgba(255,165,0) — around 2:1 against this background, which is
      unreadable for body copy. Near-black text on the amber shell reads as an
      amber banner without failing contrast.
    -->
    <exclamation-triangle-icon
      class="w-5 h-5 shrink-0 text-warning"
      aria-hidden="true"
    />
    <p class="text-s-14">{{ $t('perps.status.unavailable') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { usePerpsStatus } from '../composables/usePerpsStatus'
import { usePerpsRestriction } from '../composables/usePerpsRestriction'

const { isServiceUnavailable } = usePerpsStatus()
const { isPerpsRestricted } = usePerpsRestriction()

// The jurisdiction block outranks service availability: when perps are
// unavailable in the region, whether the service is up is irrelevant and a
// second banner would only compete with the restricted notice.
const showBanner = computed(
  () => isServiceUnavailable.value && !isPerpsRestricted.value,
)
</script>
