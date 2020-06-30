<template>
  <v-carousel
    class="mew-carousel"
    active-class="active-carousel-item"
    :cycle="true"
    :show-arrows-on-hover="true"
  >
    <v-carousel-item
      :ripple="true"
      eager
      v-for="(slide, idx) in totalSlides"
      :link="typeof slide === 'string'"
      :href="typeof slide === 'string' ? slide : null"
      :key="idx"
    >
      <slot :name="'slide' + (idx + 1)" />
    </v-carousel-item>
  </v-carousel>
</template>


<script>
export default {
  props: {
    /**
     * Pass the total number of slides if there are no links or else pass in an array of links, i.e ['https://www.google.com/', 'https://www.myetherwallet.com/']
     */
    totalSlides: {
      type: [ Number, Array ],
      default: 0
    }
  }

}
</script>

<style lang="scss">
.mew-carousel {
  .v-carousel__controls {
    background: transparent !important;
  }
  .v-carousel__controls__item {
    color: var(--v-inputBorder-base) !important;

    &.v-item--active {
      color: var(--v-primary-base) !important;
    }
  }
}
</style>