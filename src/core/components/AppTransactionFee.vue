<template>
  <div class="core--components--app-transaction-fee">
    <!--
    =====================================================
      AppNetworkSettings
    =====================================================
    -->
    <app-network-settings-modal
      :open-settings="openSettings"
      :close="closeGasPrice"
      :gas-price-modal="gasPriceModal"
      :selected="gasPriceType"
      :not-enough-eth="notEnoughEth"
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
            {{ actualFeeFormatted }} ETH
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
            {{ actualCostFormatted }} ETH
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { EventBus } from '@/core/plugins/eventBus';
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
    totalCost: {
      type: String,
      default: '0'
    },
    txFee: {
      type: String,
      default: '0'
    },
    gasPriceType: {
      type: String,
      default: 'economy'
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
    }
  },
  data() {
    return { gasPriceModal: false };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'swapLink']),
    costToEth() {
      return fromWei(this.totalCost);
    },
    actualCostFormatted() {
      return formatFloatingPointValue(this.costToEth).value;
    },
    feeToEth() {
      return fromWei(this.txFee);
    },
    actualFeeFormatted() {
      return formatFloatingPointValue(this.feeToEth).value;
    },
    feeInUsd() {
      const value = formatFiatValue(
        BigNumber(this.feeToEth).times(this.fiatValue).toFixed(2)
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
  methods: {
    openSettings() {
      EventBus.$emit('toggleSettings');
      this.gasPriceModal = false;
    },
    closeGasPrice() {
      this.gasPriceModal = false;
    },
    openGasPriceModal() {
      this.gasPriceModal = true;
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
