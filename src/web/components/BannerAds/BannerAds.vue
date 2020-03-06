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
        <Ad />
      </v-carousel-item>
    </v-carousel>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import Ad from '@/web/components/Ad';
import Ad1 from '@/web/components/Ad1';

export default {
  components: { WhiteSheet, Ad, Ad1 }
};
</script>
