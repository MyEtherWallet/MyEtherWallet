<template>
  <div class="form-block tx-fee-container">
    <div class="tx-fee">
      <div class="title">
        <h4>
          {{ title !== '' ? title : $t('common.txFee') }}
        </h4>
        <p class="copy-button prevent-user-select" @click="openSettings">
          {{ $t('common.edit') }}
        </p>
      </div>
      <div class="fee-value">
        <div class="gwei">
          {{ gasPrice }} Gwei
          <!--(Economic)-->
        </div>
        <div v-show="network.type.name === 'ETH'" class="usd">
          Cost {{ txFeeEth }} ETH = ${{ convert }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import ethUnit from 'ethjs-unit';
import fetch from 'node-fetch';
import { Toast } from '@/helpers';

export default {
  props: {
    gasLimit: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ethPrice: 0
    };
  },
  computed: {
    ...mapState(['network', 'gasPrice', 'account', 'web3', 'online']),
    txFee() {
      return new BigNumber(ethUnit.toWei(this.gasPrice, 'gwei')).times(
        this.gasLimit || 0
      );
    },
    txFeeEth() {
      if (new BigNumber(this.txFee).gt(0)) {
        return ethUnit.fromWei(this.txFee, 'ether');
      }
      return 0;
    },
    convert() {
      if (this.ethPrice) {
        return new BigNumber(
          new BigNumber(this.txFeeEth).times(new BigNumber(this.ethPrice))
        )
          .toFixed(2)
          .toString();
      }
      return '--';
    }
  },
  watch: {
    network(newVal) {
      if (this.online && newVal.type.name === 'ETH') this.getEthPrice();
    }
  },
  mounted() {
    if (this.online && this.network.type.name === 'ETH') this.getEthPrice();
  },
  methods: {
    openSettings() {
      this.$eventHub.$emit('open-settings');
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice = price.data.ETH.quotes.USD.price;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GasPriceDisplayUpdate.scss';
</style>
