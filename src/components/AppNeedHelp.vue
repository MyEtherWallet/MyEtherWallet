<template>
  <div>
    <a
      :href="helpLink"
      target="_blank"
      class="block text-info text-base font-medium leading-p-150 -tracking-[0.02em] hoverOpacity"
    >
      <span :class="{ underline: !title }"> Need Help? </span>
      <span v-if="title" class="underline">
        {{ title }} <span class="text-sm">→ </span></span
      >
    </a>
  </div>
</template>

<script setup lang="ts">
//TODO: add Amplitude event with link + route location

/**
 * @file AppNeedHelp.vue
 * @description This component provides help and support options for users within the MyEtherWallet application.
 *
 * @example With Link Text
 * <app-need-help
 *   title="What is gas?"
 *   help-link="https://help.myetherwallet.com/en/article/what-is-gas"
 * />
 *
 * @example Without Link Text
 * <app-need-help help-link="https://help.myetherwallet.com/en/article/what-is-gas" />
 *
 */

defineProps({
  /**
   * @title: title of the help page
   */
  title: {
    type: String,
  },
  /**
   * @helpLink: url to the help page
   */
  helpLink: {
    type: String,
    required: true,
  },
})
</script>
