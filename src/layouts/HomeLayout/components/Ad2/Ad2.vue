<template>
  <div class="ad2">
    <v-container>
      <div class="d-flex align-center px-6">
        <div>
          <div class="white--text font-weight-bold display-1 mb-2">
            Ready? Get your wallet today.
          </div>
          <div class="white--text">
            Still don't know how to do it? Go to <a href="/">Help center</a>.
          </div>
        </div>
        <v-spacer />
        <StdButton buttonclass="button--white">
          <v-img
            width="40"
            height="40"
            src="@/assets/images/Common/Icons/wallet.svg"
            class="mr-3 mt-2"
          />
          Get a new wallet
        </StdButton>
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
