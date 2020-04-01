<template>
  <v-container>
    <v-card class="card-content d-flex align-center" flat>
      <div>
        <h2 class="white--text">
          Newbie in crypto?
        </h2>
        <h2 class="white--text">
          Join our journey to MEW.
        </h2>
      </div>
      <v-spacer />
      <StdButton
        size="x-large"
        buttonclass="button--white-border"
        href="https://www.mewtopia.com/"
        target="_blank"
        >Get Started</StdButton
      >
    </v-card>
  </v-container>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  name: 'HomeAd1',
  components: {
    StdButton
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

.v-card {
  border-radius: 10px !important;
}

.card-content {
  background: linear-gradient(130deg, #0b2840 0%, #3d9e91 80%, #00c4ff 100%);
  padding: 70px 90px;
}
</style>
