<template>
  <WhiteSheet sideinfo>
    <v-carousel
      cycle
      height="150"
      hide-delimiter-background
      show-arrows-on-hover
      light
      interval="7000"
    >
      <v-carousel-item>
        <Ad />
      </v-carousel-item>
      <v-carousel-item>
        <Ad />
      </v-carousel-item>
      <v-carousel-item>
        <Ad />
      </v-carousel-item>
    </v-carousel>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import Ad from '@/web/components/Ad';

export default {
  components: { WhiteSheet, Ad }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>