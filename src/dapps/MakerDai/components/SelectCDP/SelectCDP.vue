<template>
  <div>
    <interface-container-title :title="'MAKER'" />
    <div class="container-maker">
      <div class="manage-container">
        <div class="content-container">
          <p class="cpd-title">{{ $t('dapps.cdpPortal') }}</p>
          <div class="cdp-id">
            <p>
              {{ $t('dapps.currentPrice') }}:
              <b>{{ ethPrice.toString() }}</b> USD
            </p>
          </div>
        </div>
        <div v-if="!cdpDetailsLoaded">
          Loading CDP Details
        </div>
        <div v-if="cdpDetailsLoaded">
          <div v-for="(cdp, idx) in cdps" :key="cdp + idx">
            <select-cdp-entry
              :a-cdp="availableCdps[cdp]"
              :cdp-id="cdp"
            ></select-cdp-entry>
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
import Maker from '@makerdao/dai';
import SelectCdpEntry from '../SelectCdpEntry';
const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};
export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'select-cdp-entry': SelectCdpEntry
  },
  props: {
    cdps: {
      type: Array,
      default: function() {
        return [];
      }
    },
    availableCdps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cdpDetailsLoaded: {
      type: Boolean,
      default: false
    },
    maker: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      loaded: false,
      serverUrl: KOVAN_SERVER_URL,
      wethToPethRatio: 0,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      selectedCdp: '',
      cdp: {},
      eth: toBigNumber(0),
      dai: toBigNumber(0),
      debtValue: toBigNumber(0),
      collatRatio: toBigNumber(0),
      pethCollateral: toBigNumber(0),
      usdCollateral: toBigNumber(0),
      ethCollateral: toBigNumber(0),
      ratio: null,
      isSafe: false,
      maxDaiDraw: toBigNumber(0),
      maxPethDraw: toBigNumber(0),
      maxEthDraw: toBigNumber(0)
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network',
      ens: 'ens'
    })
  },
  async mounted() {
    if (!this.makerActive) {
      this.$router.push({
        name: 'Maker'
      });
    }
  },
  methods: {
    openManage(cdp) {
      this.$router.push({
        name: 'manage',
        params: {
          cdpId: cdp
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
@import 'SelectCDP';
</style>
