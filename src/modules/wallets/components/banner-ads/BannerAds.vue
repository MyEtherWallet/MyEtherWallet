<template>
  <mew-carousel carousel-height="145" :total-slides="2">
    <template v-slot:slide1>
      <mew6-white-sheet class="banner">
        <ad title="MEWwallet" />
      </mew6-white-sheet>
    </template>
    <template v-slot:slide2>
      <mew6-white-sheet class="banner">
        <ad title="MEWconnect" />
      </mew6-white-sheet>
    </template>
  </mew-carousel>
</template>

<script>
import ad from './components/ad';

export default {
  components: { ad }
};
</script>

<style lang="scss" scoped>
.banner {
  height: 145px;
}
</style>
