<template>
  <v-container>
    <v-card class="card-content d-flex align-center">
      <div>
        <div class="white--text font-weight-bold display-1">
          Newbie in crypto?
        </div>
        <div class="white--text font-weight-bold display-1">
          Join our journey to MEW.
        </div>
      </div>
      <v-spacer />
      <StdButton buttonclass="button--white-border">Get Started</StdButton>
    </v-card>
  </v-container>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  name: 'HomeContainer',
  components: {
    StdButton
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
.v-card {
  border-radius: 10px !important;
}

.card-content {
  background: linear-gradient(130deg, #0b2840 0%, #3d9e91 80%, #00c4ff 100%);
  padding: 70px 90px;
}
</style>
