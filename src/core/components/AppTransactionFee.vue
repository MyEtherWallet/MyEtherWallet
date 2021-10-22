<template>
  <div class="core--components--app-transaction-fee">
    <!--
    =====================================================
      AppNetworkSettings
    =====================================================
    -->
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

    <!--
    =====================================================
      Title
    =====================================================
    -->
    <div class="d-flex align-center mb-2">
      <div class="mew-heading-3 ml-4">Transaction fee</div>
    </div>

    <!--
    =====================================================
      Loader: present when loading Fee
    =====================================================
    -->
    <div v-show="gettingFee || !showFee" style="max-width: 556px">
      <v-skeleton-loader type="heading" class="mt-2 px-sm-2 align-center" />
      <v-skeleton-loader
        type="heading"
        class="mt-2 px-sm-2 align-center d-block d-sm-none"
      />
    </div>

    <v-row v-if="!gettingFee && showFee">
      <v-col cols="auto">
        <!--
      =====================================================
        Transaction fee selector button
      =====================================================
      -->
        <div class="d-flex align-center flex-wrap mb-2">
          <v-btn
            depressed
            class="text-transform--initial"
            @click="openGasPriceModal"
          >
            <div class="d-flex align-center">
              <div :class="hasError ? 'error--text' : 'textBlack2--text'">
                {{ feeInUsd }}
              </div>
              <v-icon :color="hasError ? 'error' : ''" small class="mx-2">
                mdi-arrow-right
              </v-icon>
              <div class="d-flex align-center">
                <v-icon :color="hasError ? 'error' : ''" small>
                  mdi-clock-outline
                </v-icon>
                <div :class="hasError ? 'error--text' : ''">
                  {{ timeWillTake }}
                </div>
              </div>
              <v-icon :color="hasError ? 'error' : ''" class="ml-3">
                mdi-chevron-down
              </v-icon>
            </div>
          </v-btn>
          <div
            :class="hasError ? 'error--text' : 'textSecondary--text'"
            class="ml-3 py-1"
          >
            {{ txFeeFormatted }} {{ network.type.currencyName }}
          </div>
        </div>

        <!--
      =====================================================
        Not enough balance warning / Error
      =====================================================
      -->
        <div
          v-if="!gettingFee & hasError"
          :class="[hasError ? 'error--text' : '']"
          class="ml-2"
        >
          {{ message }}
          <a
            v-if="notEnoughEth"
            rel="noopener noreferrer"
            target="_blank"
            :href="swapLink"
          >
            Buy more ETH
          </a>
        </div>
      </v-col>

      <v-spacer />

      <v-col v-if="fromEth" cols="12" lg="auto">
        <v-divider class="py-2 d-block d-lg-none" />
        <div class="py-2 ml-2 text-right">
          <div>
            <span class="mr-2">Total:</span>
            {{ actualCostFormatted }} {{ network.type.currencyName }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import AppNetworkSettingsModal from './AppNetworkSettingsModal.vue';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { estimatedTime } from '@/core/helpers/gasPriceHelper';
import { fromWei } from 'web3-utils';
export default {
  name: 'AppTransactionFee',
  components: { AppNetworkSettingsModal },
  props: {
    showFee: {
      type: Boolean,
      default: false
    },
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
    message: {
      type: String,
      default: ''
    },
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    fromEth: {
      type: Boolean,
      default: false
    },
    totalGasLimit: {
      type: String,
      default: '0'
    }
  },
  data() {
    return { gasPriceModal: false };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', [
      'network',
      'isEthNetwork',
      'swapLink',
      'gasPriceByType'
    ]),
    ...mapState('global', ['online', 'gasPriceType']),
    txFeeInEth() {
      return fromWei(this.txFee);
    },
    costInEth() {
      return fromWei(this.totalCost);
    },
    txFeeFormatted() {
      return formatFloatingPointValue(this.txFeeInEth).value;
    },
    actualCostFormatted() {
      return formatFloatingPointValue(this.costInEth).value;
    },
    feeInUsd() {
      const value = formatFiatValue(
        BigNumber(this.txFeeInEth).times(this.fiatValue).toFixed(2)
      ).value;
      return `~${'$' + value}`;
    },
    hasError() {
      return this.error !== '';
    },
    timeWillTake() {
      return estimatedTime(this.gasPriceType);
    }
  },
  mounted() {
    // update gasprice every 2 minutes
    setInterval(() => {
      this.handleLocalGasPrice(this.gasPriceByType(this.gasPrice));
    }, 60 * 2000);
  },
  methods: {
    ...mapActions('global', ['updateGasPrice']),
    closeGasPrice() {
      this.gasPriceModal = false;
    },
    openGasPriceModal() {
      this.updateGasPrice().then(() => {
        this.gasPriceModal = true;
      });
    },
    handleLocalGasPrice(val) {
      this.$emit('onLocalGasPrice', val);
    }
  }
};
</script>

<style lang="scss">
.core--components--app-transaction-fee {
  .v-skeleton-loader__heading {
    width: 100% !important;
  }
}
</style>
