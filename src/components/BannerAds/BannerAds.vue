<template>
  <mew6-white-sheet eet sideinfo class="user-select--none">
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
  </mew6-white-sheet>
</template>

<script>
import Ad1 from './components/Ad1';
import Ad2 from './components/Ad2';

export default {
  components: { Ad1, Ad2 }
};
</script>
