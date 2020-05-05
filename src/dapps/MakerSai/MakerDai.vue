<template>
  <div class="container-maker">
    <back-button :path="'/interface/dapps/'"> </back-button>
    <div class="maker-announcement">
      On April 24th the Maker community voted to shutdown the Single Collateral
      DAI (SAI) system on May 12th.

      <div class="maker-info">
        <b> What does shutdown mean?</b>
        <br />
        Once Single-Collateral Dai is shut down, every SAI in circulation will
        be redeemable for 1 USD worth of ETH. SAI can be redeemed for ETH at
        migrate.makerdao.com. Note that SAI will only be worth an equivalent USD
        amount of ETH at the exact time of shutdown, where the redeemable
        amounts of ETH per SAI are calculated. Since ETH is a volatile asset,
        your claim can vary in value after shut down, and SAI will thus become
        an asset pegged to ETH. Therefore, if you want to avoid exposure to
        price swings of ETH, you should redeem your Sai for ETH as soon as
        possible after shutdown, and trade that ETH for Dai.
      </div>

      <br />
      To learn more, including steps available to redeem or convert any existing
      SAI or CDP, please see
      <br />
      <a
        class="maker-link"
        href="https://blog.makerdao.com/a-guide-to-single-collateral-dai-sai-shutdown/"
        ><b>A Guide to Single-Collateral Dai (Sai) Shutdown</b>
      </a>
      <br />
      or
      <br />
      <a
        class="maker-link"
        href="https://forum.makerdao.com/t/sequential-process-for-scd-shutdown/1823"
        ><b>Sequential Process for SCD Shutdown</b></a
      >
    </div>

    <div class="buttons-container"></div>

    <router-view> </router-view>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'back-button': BackButton
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>
