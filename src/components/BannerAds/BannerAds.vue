<template>
  <MewCarousel :total-slides="2">
    <template v-slot:slide1>
      <Ad1 />
    </template>
    <template v-slot:slide2>
      <Ad2 />
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
