<template>
  <!--
  =====================================================================================
    Mew Info Card - mainly used on MEW's landing page.
  =====================================================================================
  -->
  <v-card :max-width="maxWidth" class="info-card elevation-3">
    <div class="pa-5">
      <div class="text-center">
        <img :src="icon" />
      </div>
      <!--
  =====================================================================================
    Mew Info Card Title, has slot: titleIconContainer (used to place a custom icon next to the title).
  =====================================================================================
  -->
      <v-card-title
        :class="[
          'font-weight-bold',
          'mew-heading-2',
          'titlePrimary--text',
          'pt-0'
        ]"
      >
        {{ title }}
        <slot name="titleIconContainer" />
      </v-card-title>
      <!--
  =====================================================================================
    Mew Info Card Subtitle, has slot: desc (used to place custom desc).
  =====================================================================================
  -->
      <v-card-subtitle class="titlePrimary--text mt-1">
        <slot name="desc" />
        {{ desc }}
      </v-card-subtitle>
      <!--
  =====================================================================================
    Mew Info Card Text, has slot: buttonContainer (used to place custom buttons).
  =====================================================================================
  -->
      <v-card-text v-if="link.url && link.title">
        <a class="font-weight-medium" :href="link.url"
          >{{ link.title
          }}<v-icon class="subtitle-1 ml-1" color="primary"
            >mdi-arrow-right</v-icon
          ></a
        >
        <slot name="buttonContainer" />
      </v-card-text>
    </div>
    <!--
  =====================================================================================
    Slot: cardImg -  used to place a custom image at the bottom of the card.
  =====================================================================================
  -->
    <div class="text-center">
      <slot name="cardImg" />
    </div>
  </v-card>
</template>

<script setup>
// props
defineProps({
  /**
   * Title of the card.
   */
  title: {
    type: String,
    default: ''
  },
  /**
   * The description of the card.
   */
  desc: {
    type: String,
    default: ''
  },
  /**
   * The icon url. Inserts an icon on top.
   */
  icon: {
    type: [String, Array],
    default: ''
  },
  /**
   * The link object. Takes a title and url, i.e. {title: '', url: ''}.
   * This is displayed below the description.
   */
  link: {
    type: Object,
    default: () => {
      return {
        title: '',
        url: ''
      };
    }
  },
  /**
   * The max width of the info card. Default is 300px.
   */
  maxWidth: {
    type: String,
    default: '300'
  }
});
</script>

<style lang="scss" scoped>
.info-card {
  border: 1px solid var(--v-swapDisable-base);
  border-radius: 10px;
}
</style>
