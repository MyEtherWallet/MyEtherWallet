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
      High fees pop up
    =====================================================
    -->
    <app-modal
      :show="openHighFeeNote"
      :close="closeHighFeeNote"
      :has-buttons="false"
    >
      <template #dialogBody>
        <div class="mew-heading-1 mb-2">Why are the fees so high?</div>
        <div class="mew-heading-1">Are you guys out of your minds?</div>
        <div class="mt-6 textPrimary--text">
          Fees are indeed high these days. We feel your pain!
          <br />
          <br />
          Transaction fees are charged by Ethereum miners, not MEW. We can't
          influence them and we don't receive any part of the transaction fees
          that you pay.
          <br />
          <br />
          Ethereum is getting more and more popular, but its capacity is
          limited, this is why when the network is congested, it can cost
          $10-$20 to send a token, and a simple swap transaction can set you
          back $100 or even more.
          <br />
          <br />
          Many teams in the Ethereum community are working hard to solve this
          problem: Ethereum 2.0 is gradually being built, numerous Layer 2
          solutions are getting launched. It is still very early days of
          Ethereum, and this is the current state of the technology.
        </div>
      </template>
    </app-modal>

    <!--
    =====================================================
      Title
    =====================================================
    -->
    <div class="d-flex align-center mb-2">
      <div class="mew-heading-3 ml-4">Transaction fee</div>
      <mew-tooltip class="pl-1" :text="feeTitleTooltip" max-width="300px" />
    </div>

    <!--
    =====================================================
      Loader: present when loading Fee
    =====================================================
    -->
    <div v-show="gettingFee || !showFee" style="max-width: 556px">
      <v-skeleton-loader type="heading" class="mt-2 px-sm-2 align-center" />
      <v-skeleton-loader type="heading" class="mt-2 px-sm-2 align-center" />
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
                {{ feesInUsd }}
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

        <!--
      =====================================================
        Too high transaction fee / Buy more ETH
      =====================================================
      -->
        <div
          class="ml-2 mr-1 primary--text cursor--pointer user-select--none"
          @click="openHighFeeNote = true"
        >
          Why are the fees so high?
        </div>
      </v-col>

      <v-spacer />

      <v-col v-if="fromEth" cols="12" lg="auto">
        <v-divider class="py-2 d-block d-lg-none" />
        <div class="py-2 ml-2 text-right">
          <div>
            <span class="mr-2">Total:</span>
            {{ actualFeeFormatted }} ETH
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
import AppModal from '@/core/components/AppModal';
import AppNetworkSettingsModal from './AppNetworkSettingsModal.vue';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { estimatedTime } from '@/core/helpers/gasPriceHelper';
import { fromWei } from 'web3-utils';
export default {
  name: 'AppTransactionFee',
  components: { AppModal, AppNetworkSettingsModal },
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
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    totalFees: {
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
    isSwap: {
      type: Boolean,
      default: false
    },
    fromEth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { gasPriceModal: false, openHighFeeNote: false };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'swapLink']),
    feeToEth() {
      return fromWei(this.totalFees);
    },
    actualFeeFormatted() {
      return formatFloatingPointValue(this.feeToEth).value;
    },
    feesInUsd() {
      const value = formatFiatValue(
        BigNumber(this.feeToEth).times(this.fiatValue).toFixed(2)
      ).value;
      return `~${'$' + value}`;
    },
    hasError() {
      return this.error !== '';
    },
    feeTitleTooltip() {
      return this.isSwap
        ? 'Maximum possible transaction fee is shown. Actual fee is likely to be less once your swap is executed.'
        : 'Maximum possible transaction fee is shown. Actual fee is likely to be less once your transaction is executed.';
    },
    timeWillTake() {
      return estimatedTime(this.gasPriceType);
    }
  },
  methods: {
    closeHighFeeNote() {
      this.openHighFeeNote = false;
    },
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
