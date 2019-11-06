<template>
  <div class="ad2">
    <v-container>
      <div class="d-flex align-center">
        <div class="white--text font-weight-bold display-1">
          Ready? Get your wallet today.
        </div>
        <v-spacer />
        <StdButton />
      </div>
    </v-container>
  </div>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  name: 'HomeAd2',
  components: {
    StdButton
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

.ad2 {
  background: linear-gradient(90deg, #24a2ca 0%, #32bfa5 100%);
}
</style>
