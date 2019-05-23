<template>
  <div>
    <div class="container-maker">
      <div class="manage-container">
        <div class="content-container">
          <p class="cpd-title">{{ $t('dappsMaker.cdpPortal') }}</p>
          <div class="cdp-id">
            <p>
              {{ $t('dappsMaker.currentPrice') }}: <b>{{ ethPrice }}</b> USD
            </p>
          </div>
        </div>
        <div v-if="!cdpDetailsLoaded">
          {{ $t('dappsMaker.loadingMessage') }}
        </div>
        <div v-if="cdpDetailsLoaded">
          <div
            v-for="(cdp, idx) in Object.keys(availableCdps)"
            :key="cdp + idx"
          >
            <select-cdp-entry
              :a-cdp="cdpOptions[cdp]"
              :cdp-id="cdp"
            ></select-cdp-entry>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import SelectCdpEntry from '../../components/SelectCdpEntry';

const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'select-cdp-entry': SelectCdpEntry
  },
  props: {
    ethPrice: {
      type: BigNumber,
      default: function() {
        return new BigNumber(0);
      }
    },
    makerActive: {
      type: Boolean,
      default: false
    },
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
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    cdpOptions() {
      return this.availableCdps;
    }
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
