<template>
  <div class="core--components--app-transaction-fee">
    <!--
    =====================================================
      AppModal
    =====================================================
    -->
    <app-modal
      :show="openHighFeeNote"
      :close="closeHighFeeNote"
      :has-buttons="false"
    >
      <template #dialogBody>
        <div class="mew-heading-1 mb-2">How are fees determined?</div>
        <div class="mt-6 textPrimary--text">
          Transaction fees are charged by Ethereum miners, not MEW. We can't
          influence them and we don't receive any part of the transaction fees
          that you pay.
        </div>
        <div class="mew-heading-1 my-2 mt-6">What should I do?</div>
        <div class="mt-6 textPrimary--text">
          Good news! You have options! If you’re not in a hurry, you can use the
          “Normal” setting and your transaction will be mined at a later time.
          MEW supports Ethereum scaling solutions Polygon and Binance Smart
          Chain (accessible on MEW web and Android). Consider using these chains
          to avoid congestion and save on fees. Learn how
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://help.myetherwallet.com/en/?q=network"
            >here</a
          >.
        </div>
      </template>
    </app-modal>
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
      <v-col cols="12">
        <!--
      =====================================================
        Transaction fee selector button
      =====================================================
      -->
        <div class="d-flex align-center justify-space-between flex-wrap mb-2">
          <div class="d-flex align-center flex-wrap flex-grow-1">
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
          <div v-if="fromEth">
            <div class="py-2 ml-2 text-right">
              <div>
                <span class="mr-2">Total:</span>
                {{ actualCostFormatted }} {{ network.type.currencyName }}
              </div>
            </div>
          </div>
        </div>

        <!--
      =====================================================
        Not enough balance warning / Error
      =====================================================
      -->
        <div class="d-flex flex-wrap justify-space-between">
          <div
            v-if="!gettingFee & hasError"
            :class="[hasError ? 'error--text' : '']"
            class="ml-2"
          >
            {{ error }}
            <a
              v-if="notEnoughEth"
              rel="noopener noreferrer"
              target="_blank"
              :href="swapLink"
            >
              Buy more ETH
            </a>
          </div>
          <div>
            <div
              v-if="isEthNetwork"
              class="ml-2 primary--text cursor--pointer user-select--none"
              @click="showHighNote"
            >
              How are fees determined?
            </div>
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
import AppModal from '@/core/components/AppModal.vue';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { estimatedTime } from '@/core/helpers/gasPriceHelper';
import { fromWei } from 'web3-utils';
export default {
  name: 'AppTransactionFee',
  components: { AppNetworkSettingsModal, AppModal },
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
    return { gasPriceModal: false, openHighFeeNote: false, interval: () => {} };
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
  watch: {
    gasPriceModal() {
      clearInterval(this.interval);
      this.interval = this.setGasPriceInterval();
    }
  },
  mounted() {
    // update gasprice every 2 minutes
    this.interval = this.setGasPriceInterval();
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
      this.$emit('onLocalGasPrice', val);
    },
    showHighNote() {
      this.openHighFeeNote = true;
    },
    closeHighFeeNote() {
      this.openHighFeeNote = false;
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
