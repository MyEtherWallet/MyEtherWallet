<template>
  <MewCarousel :total-slides="2">
    <template v-slot:slide1>
      <mew6-white-sheet class="banner">
        <Ad1 />
      </mew6-white-sheet>
    </template>
    <template v-slot:slide2>
      <mew6-white-sheet class="banner">
        <Ad2 />
      </mew6-white-sheet>
    </template>
  </MewCarousel>
</template>

<script>
import Ad1 from './components/Ad1';
import Ad2 from './components/Ad2';

export default {
  components: { Ad1, Ad2 }
};
</script>

<style lang="scss" scoped>
.banner {
  height: 145px;
}
</style>
