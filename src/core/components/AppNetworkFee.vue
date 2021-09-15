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
    <div class="mt-5 mb-8">
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
        Desktop Network Fee selector
      =====================================================
      -->
      <v-row justify="space-between" align="start">
        <!--
        =====================================================
          Title: Network Fee
        =====================================================
        -->
        <v-col cols="12" sm="4" class="pb-0">
          <div class="d-flex align-center justify-start pl-4">
            <div class="mew-heading-3 mb-0">Network fee</div>
            <mew-tooltip
              class="pl-1"
              :text="feeTitleTooltip"
              max-width="300px"
            />
          </div>
        </v-col>
        <v-spacer class="d-none d-sm-flex" />
        <!--
        =====================================================
         Fee Content
        =====================================================
        -->
        <v-col class="d-flex justify-end align-center">
          <v-row dense>
            <v-col cols="12 py-0">
              <div class="d-block d-sm-flex justify-start">
                <!--
                =====================================================
                  Type: ie Economy
                =====================================================
                -->
                <div
                  class="
                    d-flex
                    justify-start justify-sm-space-around
                    align-center
                  "
                >
                  <mew-icon :icon-name="icon" :img-height="30" />
                  <span class="capitalize pl-2 mew-heading-4">{{
                    gasPriceType
                  }}</span>
                </div>
                <!--
                =====================================================
                  Fee: Eth & Fiat Value,  present when Fee is loaded
                =====================================================
                -->
                <div
                  v-if="!gettingFee && showFee"
                  :class="[
                    $vuetify.breakpoint.xs ? 'mew-body' : 'mew-heading-4',
                    ' pl-0 pl-sm-2 textSecondary--text d-flex eth-fee align-center'
                  ]"
                >
                  {{ actualFeeFormatted }} {{ network.type.currencyName }}

                  <span
                    :class="[
                      hasError ? 'error--text' : 'black--text',
                      'px-2',
                      $vuetify.breakpoint.xs ? 'mew-body' : 'mew-heading-4'
                    ]"
                    >{{ feesInUsd }}</span
                  >
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
              </div>
            </v-col>
            <!--
            =====================================================
              Error message
            =====================================================
            -->
            <v-col v-if="!gettingFee & hasError" cols="12">
              <div :class="[hasError ? 'error--text' : '', 'mew-label']">
                {{ message }}
              </div>
            </v-col>
            <!--
            =====================================================
              High Fees pop up button
            =====================================================
            -->
            <v-col v-if="isEthNetwork" cols="12" class="pt-0">
              <div class="d-flex align-center justify-start pt-1">
                <div
                  class="
                    mr-3
                    primary--text
                    cursor--pointer
                    user-select--none
                    mew-label
                    font-weight-medium
                  "
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
            </v-col>
          </v-row>
        </v-col>
        <!--
        =====================================================
         Button: Chage Fee Button
        =====================================================
        -->
        <v-col cols="1">
          <div class="d-flex justify-end align-center">
            <img
              class="btn-circle"
              src="@/assets/images/icons/icon-edit-btn.svg"
              alt="edit"
              @click="openGasPriceModal"
            />
          </div>
        </v-col>
      </v-row>
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

const GAS_TYPE_ICONS = {
  economy: 'bicycle',
  regular: 'car',
  fast: 'rocket',
  stored: 'tags'
};
export default {
  name: 'AppNetworkFee',
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
    }
  },
  data() {
    return { gasPriceModal: false, openHighFeeNote: false };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'isEthNetwork', 'swapLink']),

    icon() {
      return GAS_TYPE_ICONS[this.gasPriceType];
    },
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
    }
  },
  methods: {
    closeHighFeeNote() {
      this.openHighFeeNote = false;
    },
    openSettings() {
      EventBus.$emit('openSettings');
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
