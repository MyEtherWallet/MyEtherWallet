<template>
  <div class="tx-info-block">
    <div class="wrap">
      <div class="tx">
        <div class="currency left">
          <div class="currency-type">
            <img :src="imageETH">
            <span>ETH</span>
          </div>
          <p class="amount">1.0000</p>
        </div>
        <div class="tx-direction">
          <img :src="rArrow">
        </div>
        <div class="currency right">
          <div class="currency-type">
            <img :src="imageBTC">
            <span>BTC</span>
          </div>
          <p class="amount">0.0004352</p>
        </div>
      </div>

      <div class="progress">
        <p class="progress-time">08:25</p>
        <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
import RightArrow from '@/assets/images/icons/right-arrow.svg';
import ETH from '@/assets/images/currency/eth.svg';
import BTC from '@/assets/images/currency/btc.svg';

export default {
  data() {
    return {
      rArrow: RightArrow,
      imageETH: ETH,
      imageBTC: BTC
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TxInfoBlock.scss';
</style>
