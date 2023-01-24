<template>
  <div>
    <app-network-settings-modal
      :close="closeGasPrice"
      :gas-price-modal="gasPriceModal"
      :not-enough-eth="notEnoughEth"
      :cost-in-eth="costInEth"
      :tx-fee-formatted="txFeeFormatted"
      :tx-fee-usd="feeInUsd"
      :total-gas-limit="totalGasLimit"
      @onLocalGasPrice="handleLocalGasPrice"
      @close="closeGasPrice"
    />
    <app-fee-note :show="openHighFeeNote" :close="closeHighFeeNote" />
    <v-row>
      <v-col
        >Network Fee
        <v-icon small @click="showHighNote"
          >mdi-information-outline</v-icon
        ></v-col
      >
      <v-col md="auto">
        <div>
          <span
            v-if="!error && !gettingFee"
            class="fee-button"
            @click="openGasPriceModal"
          >
            {{ feeInUsd }} <v-icon>mdi-chevron-down</v-icon>
          </span>
          <span v-else-if="gettingFee">
            Getting Fee <v-icon>mdi-alert-circle-outline</v-icon>
          </span>
          <span v-else class="error--text">
            {{ error }} <v-icon color="error">mdi-alert-circle-outline</v-icon>
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { fromWei } from 'web3-utils';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { mapGetters, mapActions, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import AppNetworkSettingsModal from '@/core/components/AppNetworkSettingsModal.vue';
import AppFeeNote from '@/core/components/AppFeeNote.vue';
export default {
  name: 'SwapFee',
  components: {
    AppNetworkSettingsModal,
    AppFeeNote
  },
  mixins: [handlerAnalytics],
  props: {
    gettingFee: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    txFee: {
      type: String,
      default: '0'
    },
    totalCost: {
      type: String,
      default: '0'
    },
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    totalGasLimit: {
      type: String,
      default: '0'
    },
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { gasPriceModal: false, openHighFeeNote: false, interval: () => {} };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'gasPriceByType']),
    ...mapState('global', ['gasPriceType', 'preferredCurrency']),
    txFeeInEth() {
      return fromWei(this.txFee);
    },
    costInEth() {
      const cost = new BigNumber(this.totalCost).toFixed();
      return fromWei(cost);
    },
    txFeeFormatted() {
      return formatFloatingPointValue(this.txFeeInEth).value;
    },
    feeInUsd() {
      const value = formatFiatValue(
        BigNumber(this.txFeeInEth).times(this.fiatValue).toFixed(2),
        { currency: this.preferredCurrency }
      ).value;
      return value;
    }
  },
  watch: {
    gasPriceModal() {
      clearInterval(this.interval);
      this.interval = this.setGasPriceInterval();
    },
    gasPriceType(newVal) {
      if (this.isSwap) {
        this.trackSwap(`swapGasSwitch: ${newVal}`);
      }
    }
  },
  mounted() {
    // update gasprice every 2 minutes
    this.interval = this.setGasPriceInterval();
    if (this.isSwap) {
      this.trackSwap(`swapGasSwitch: ${this.gasPriceType}`);
    }
  },
  methods: {
    ...mapActions('global', ['updateGasPrice']),
    setGasPriceInterval() {
      return setInterval(() => {
        this.handleLocalGasPrice(this.gasPriceByType(this.gasPrice));
      }, 60 * 2000);
    },
    closeGasPrice() {
      this.gasPriceModal = false;
    },
    openGasPriceModal() {
      this.updateGasPrice().then(() => {
        this.gasPriceModal = true;
      });
    },
    handleLocalGasPrice(val) {
      console.log(val);
      this.$emit('onLocalGasPrice', val);
    },
    showHighNote() {
      this.trackGasSwitch('openHowGasIsEstimated');
      this.openHighFeeNote = true;
    },
    closeHighFeeNote() {
      this.openHighFeeNote = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.fee-button {
  cursor: pointer;
}
</style>
