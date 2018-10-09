<template>
  <div class="wallet-not-found">
    <div class="wrap">
      <div class="page-container">

        <div class="content-block">
          <div class="block-title">Oops! Wallet not found :(</div>
          <div class="buttons">

            <router-link to="/create-wallet">
              <standard-button 
                :options="buttonGetWallet"
                @click.native="interact = true"
              />
            </router-link>
            <router-link to="/access-my-wallet">
              <standard-button 
                :options="buttonAccessWallet"
                @click.native="interact = true"
              />
            </router-link>

          </div>
          <div class="spaceman">
            <img src="~@/assets/images/home/spaceman.png">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttonGetWallet: {
        title: 'Get a Free Wallet',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      },
      buttonAccessWallet: {
        title: 'Access My Wallet',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletNotFoundContainer.scss';
</style>
