<template>
  <div>
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
    <v-skeleton-loader
      v-show="gettingFee || !showFee"
      type="text"
      width="150px"
      class="mt-2 px-sm-2 align-center"
    />

    <div v-if="!gettingFee && showFee">
      <!--
      =====================================================
        Transaction fee selector button
      =====================================================
      -->
      <div class="d-flex align-center justify-space-between flex-wrap-reverse">
        <div class="d-flex align-center flex-wrap">
          <v-btn
            depressed
            class="text-transform--initial"
            @click="openGasPriceModal"
          >
            <div class="d-flex align-center">
              <div>{{ feesInUsd }}</div>
              <v-icon small class="mx-2">mdi-arrow-right</v-icon>
              <div class="d-flex align-center">
                <v-icon small>mdi-clock-outline</v-icon>
                <div>{{ timeWillTake }}</div>
              </div>
              <v-icon class="ml-3">mdi-chevron-down</v-icon>
            </div>
          </v-btn>
          <div class="textSecondary--text ml-3 py-1">
            {{ actualFeeFormatted }} ETH
          </div>
        </div>
        <div class="py-1">Total: {{ balance }} ETH</div>
      </div>

      <!--
      =====================================================
        Not enough balance warning / Error
      =====================================================
      -->
      <div
        v-if="!gettingFee & hasError"
        :class="[hasError ? 'error--text' : '', 'mew-label']"
        class="mt-2 ml-2"
      >
        {{ message }}
      </div>

      <!--
      =====================================================
        Too high transaction fee / Buy more ETH
      =====================================================
      -->
      <div class="d-flex align-center mt-1 ml-2">
        <div
          class="mr-2 primary--text cursor--pointer user-select--none mew-label"
          @click="openHighFeeNote = true"
        >
          Why are the fees so high?
        </div>
        <a
          v-if="notEnoughEth"
          rel="noopener noreferrer"
          target="_blank"
          :href="swapLink"
          class="mew-label font-weight-medium"
          >Buy more ETH</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { EventBus } from '@/core/plugins/eventBus';
import AppModal from '@/core/components/AppModal';
import AppNetworkSettingsModal from './AppNetworkSettingsModal.vue';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

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
    balance: {
      type: String,
      default: ''
    }
  },
  data() {
    return { gasPriceModal: false, openHighFeeNote: false };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'swapLink']),

    actualFees() {
      return fromWei(this.totalFees).toString();
    },
    actualFeeFormatted() {
      return formatFloatingPointValue(this.actualFees).value;
    },
    feesInUsd() {
      const value = formatFiatValue(
        BigNumber(this.actualFees).times(this.fiatValue).toFixed(2)
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
      switch (this.gasPriceType) {
        case 'economy':
          return '15 min';
        case 'regular':
          return '5 min';
        case 'fast':
          return '2 min';
        default:
          return '';
      }
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

<style lang="scss" scoped>
.icon-holder {
  padding: 3px 6px;
  border-radius: 50%;
  cursor: pointer;
}
.eth-fee {
  white-space: nowrap;
}
</style>
