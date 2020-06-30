<template>
  <v-card
    :max-width="maxWidth"
    class="info-card elevation-3"
  >
    <div class="pa-5">
      <div class="text-center">
        <img :src="icon">
      </div>
      <v-card-title :class="[ 'font-weight-bold', 'mew-heading-2', 'titlePrimary--text', 'pt-0' ]">
        {{ title }}
        <slot name="titleIconContainer" />
      </v-card-title>
      <v-card-subtitle class="titlePrimary--text mt-1">
        <slot name="desc" />
        {{ desc }}
      </v-card-subtitle>
      <v-card-text v-if="link.url && link.title">
        <a
          class="font-weight-medium"
          :href="link.url"
        >{{ link.title }}<v-icon
          class="subtitle-1 ml-1"
          color="primary"
        >mdi-arrow-right</v-icon></a>
        <slot name="buttonContainer" />
      </v-card-text>
    </div>
    <div class="text-center">
      <slot name="cardImg" />
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    /**
     * Title of card
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
      type: [ String, Array ],
      default: ''
    },
    /**
     * The link object. Takes the link title and the url.
     */
    link: {
      type: Object,
      default: function () {
        return {
          title: '',
          url: ''
        }
      }
    },
    /**
     * The max width of the info card. Default is 300px. 
     */
    maxWidth: {
      type: String,
      default: '300'
    },
  }
}
</script>

<style lang="scss" scoped>
.info-card {
  border: 1px solid var(--v-swapDisable-base);
}
</style>