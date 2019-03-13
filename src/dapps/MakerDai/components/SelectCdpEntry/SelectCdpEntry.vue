<template>
  <div>
    <div class="container-maker">
      <div class="manage-container">
        <div class="manage-container-blocks">
          <div class="label-one-left">
            <div class="select-label">
              <p>Collateralized debt position #{{ cdpId }}</p>

              <p>
                <span class="standard-button__green-border">
                  <button class="the-button-box" @click="openManage(cdpId)">
                    Manage
                  </button>
                </span>
              </p>
            </div>
          </div>
          <div class="content-one-left">
            <div class="content-one-inner-left">
              <p>{{ $t('dapps.deposited') }}</p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp.ethCollateral) : 0 }}</b>
                ETH
              </p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp.pethCollateral) : 0 }}</b>
                PETH /
                <b>{{ aCdp ? displayFixedValue(aCdp.usdCollateral, 2) : 0 }}</b>
                USD
              </p>
              <br />
              <p>{{ $t('dapps.liquidPrice') }} (ETH/USD)</p>
              <p>
                <span class="blue-bold">{{
                  aCdp ? displayFixedValue(aCdp.liqPrice, 2) : 0
                }}</span>
                <span class="liq-usd"> USD</span>
              </p>
            </div>
            <div class="content-border">
              <div class="Line-8"></div>
            </div>
            <div class="content-one-inner-right">
              <p>{{ $t('dapps.generated') }}</p>
              <p>
                <b>{{ aCdp ? aCdp._debtValue : 0 }}</b>
                DAI
              </p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp._debtValue, 2) : 0 }}</b>
                USD
              </p>
              <br />
              <p>{{ $t('dapps.collateralRatio') }}</p>
              <p class="blue-bold">
                {{ aCdp ? displayPercentValue(aCdp.collatRatio) : 0 }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie
  },
  props: {
    cdpId: {
      type: Number,
      default: 0
    },
    aCdp: {
      type: Object,
      function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network',
      ens: 'ens'
    })
  },
  async mounted() {},
  methods: {
    openManage() {
      this.$router.push({
        name: 'manage',
        params: {
          cdpId: this.cdpId
        }
      });
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SelectCdpEntry';
</style>
