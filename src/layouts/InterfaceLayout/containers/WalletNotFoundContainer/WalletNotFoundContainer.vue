<template>
  <div class="wallet-not-found">
    <div class="wrap">
      <div class="page-container">

        <div class="content-block">
          <div class="block-title">Oops! Wallet Not Found :(</div>
          <div class="buttons">

            <router-link to="/create-wallet">
              <standard-button 
                :options="buttonGetWallet"
                class="the-button"
                @click.native="interact = true"
              />
            </router-link>
            <router-link to="/access-my-wallet">
              <standard-button 
                :options="buttonAccessWallet"
                class="the-button"
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
        buttonStyle: 'green-transparent',
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
@import 'WalletNotFoundContainer-desktop.scss';
@import 'WalletNotFoundContainer-tablet.scss';
@import 'WalletNotFoundContainer-mobile.scss';
</style>
