<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <!--
    ponytail: placeholder box until the Hero design (MEW-2094) is handed off.
    When the handoff arrives, build the hero UI here (extract shared pieces into
    `src/components/App*` DS components, keep hero-only sub-parts under
    `src/modules/home/sections/hero/`).
  -->
  <div
    data-test="home-hero-placeholder"
    class="flex h-[600px] w-full items-center justify-center rounded-2xl border border-dashed border-grey-outline bg-white/40 text-s-16 text-[#575757]"
  >
    {{ t('homePage.hero.placeholder') }}
  </div>
</template>
