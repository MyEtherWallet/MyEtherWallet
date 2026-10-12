<template>
  <div v-if="isDevMode">
    <a
      :href="helpLink"
      target="_blank"
      class="block text-text-subtle text-s-14 sm:text-s-17 leading-p-150 hoverOpacity"
    >
      <AppIcon
        name="question-mark-circle"
        variant="filled"
        size="s"
        class="display inline block mr-1 text-text-default sm:size-6"
      />
      <span class="underline"> {{ title }} </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'
import configs from '@/configs'

//Remove HelpLinks from Beta builds
const isDevMode = configs.BUILD_MODE !== 'production'

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
    required: true,
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
