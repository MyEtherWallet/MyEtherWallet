<template>
  <div>
    <div class="container-maker">
      <div class="manage-container">
        <div class="manage-container-blocks">
          <div class="label-one-left">
            <div class="select-label">
              <p>{{ $t('dappsMaker.positionLabel', {value: cdpId}) }}</p>

              <p>
                <span class="standard-button__green-border">
                  <button
                    v-if="hasProxy"
                    class="the-button-box"
                    @click="openManage(cdpId)"
                  >
                    {{ $t('dappsMaker.manage') }}
                  </button>
                  <button
                    v-if="!hasProxy"
                    class="the-button-box"
                    @click="openMigrate(cdpId)"
                  >
                    {{ $t('dappsMaker.view') }}
                  </button>
                </span>
              </p>
            </div>
          </div>
          <div class="content-one-left">
            <div class="content-one-inner-left">
              <p>{{ $t('dappsMaker.deposited') }}</p>
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
              <p>{{ $t('dappsMaker.liquidPrice') }} (ETH/USD)</p>
              <p>
                <span class="blue-bold">{{
                  aCdp ? displayFixedValue(aCdp.liquidationPrice, 2) : 0
                }}</span>
                <span class="liq-usd"> USD</span>
              </p>
            </div>
            <div class="content-border">
              <div class="Line-8"></div>
            </div>
            <div class="content-one-inner-right">
              <p>{{ $t('dappsMaker.generated') }}</p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp.debtValue) : 0 }}</b>
                DAI
              </p>
              <p>
                <b>{{ aCdp ? displayFixedValue(aCdp.debtValue, 2) : 0 }}</b>
                USD
              </p>
              <br />
              <p>{{ $t('dappsMaker.collateralRatio') }}</p>
              <p class="blue-bold">
                {{
                  aCdp
                    ? displayFixedValue(displayPercentValue(aCdp.collatRatio))
                    : 0
                }}%
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
import BigNumber from 'bignumber.js/bignumber.js';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie
  },
  props: {
    cdpId: {
      type: String,
      default: '0'
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
    }),
    hasProxy(){
      if(this.aCdp){
        return !this.aCdp.noProxy
      }
      return true;
    }
  },
  async mounted() {},
  methods: {
    openManage() {
      if(this.$route.path.includes('maker-dai')){
        this.$router.push({
          name: 'manage',
          params: {
            cdpId: this.cdpId
          }
        });
      }
    },
    openMigrate() {
      if(this.$route.path.includes('maker-dai')){
        this.$router.push({
          name: 'migrate',
          params: {
            cdpId: this.cdpId
          }
        });
      }
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      if (raw.isFinite()) {
        return raw.toFixed(decimals).toString();
      }
      return '--';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SelectCdpEntry';
</style>
