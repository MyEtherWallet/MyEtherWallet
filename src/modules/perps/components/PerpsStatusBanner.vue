<template>
  <!--
    Only rendered while `/status` answers with a server error. A 200 and a 429
    both mean the service is answering, and the unknown state (first paint, or a
    request that never got a response) reads the same way, so the page never
    opens with an outage notice it cannot substantiate.
  -->
  <AppBanner
    v-if="showBanner"
    type="warning"
    :description="$t('perps.status.unavailable')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePerpsStatus } from '../composables/usePerpsStatus'
import { usePerpsRestriction } from '../composables/usePerpsRestriction'
import AppBanner from '@/components/banner/AppBanner.vue'

const { isServiceUnavailable } = usePerpsStatus()
const { isPerpsRestricted } = usePerpsRestriction()

// The jurisdiction block outranks service availability: when perps are
// unavailable in the region, whether the service is up is irrelevant and a
// second banner would only compete with the restricted notice.
const showBanner = computed(
  () => isServiceUnavailable.value && !isPerpsRestricted.value,
)
</script>
