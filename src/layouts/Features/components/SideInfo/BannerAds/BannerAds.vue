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
        <Ad1 />
      </v-carousel-item>
      <v-carousel-item>
        <Ad2 />
      </v-carousel-item>
    </v-carousel>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import Ad1 from './components/Ad1';
import Ad2 from './components/Ad1';

export default {
  components: { WhiteSheet, Ad1, Ad2 }
};
</script>
