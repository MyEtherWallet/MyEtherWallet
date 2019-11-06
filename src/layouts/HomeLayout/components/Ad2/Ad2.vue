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
        <StdButton class="standard-button" buttonclass="button--white">
          <img
            width="60"
            height="60"
            src="@/assets/images/Common/Icons/wallet.svg"
            class="mr-2 mt-2 ml-n3"
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
  padding: 80px 0;
}

.standard-button {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
  height: 76px !important;
  min-width: 253px !important;
}
</style>
