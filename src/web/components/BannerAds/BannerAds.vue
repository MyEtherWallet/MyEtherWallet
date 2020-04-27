<template>
  <WhiteSheet sideinfo class="user-select--none">
    <v-carousel
      cycle
      height="150"
      hide-delimiter-background
      show-arrows-on-hover
      light
      interval="7000"
      :show-arrows="false"
      delimiter-icon="mdi-circle-medium"
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
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import Ad1 from './components/Ad1';
import Ad2 from './components/Ad2';

export default {
  components: { WhiteSheet, Ad1, Ad2 }
};
</script>
