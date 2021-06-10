<template>
  <div class="mt-5 mb-10">
    <app-modal :show="openHighFeeNote" :close="closeHighFeeNote" no-btn>
      <template #dialogBody>
        <div class="mew-heading-1 mb-2">Why are the fees so high?</div>
        <div class="mew-heading-1">Are you guys out of your minds?</div>
        <div class="mt-6 textPrimary--text">
          The fees are indeed high these days. We feel your pain!
          <br />
          <br />
          Transaction fees are charged by Ethereum miners, not MEW. We can't
          influence them and we don't receive any part of the transaction fees
          that you pay.
          <br />
          <br />
          Ethereum is getting more and more popular, but its capacity is
          limited, this is why when the network is congested, it can cost
          $10-$20 to send a token, and a simple Swap transaction can se you back
          $100 or even more.
          <br />
          <br />
          Many teams in the Ethereum community are working hard to solve this
          problem: Ethereum 2.0 is gradually being built, numerous Layer 2
          solutions are getting launched. It is still very early days of
          Ethereum, and this is the current state of the technology.
        </div>
      </template>
    </app-modal>
    <v-row justify="space-between" align="start">
      <v-col cols="12" sm="3" class="pb-0">
        <p class="mew-heading-3 mb-0">Network Fee</p>
      </v-col>
      <v-spacer class="d-none d-sm-flex" />
      <v-col class="d-flex justify-end align-center">
        <v-row dense>
          <v-col cols="12 py-0">
            <div class="d-flex justify-start align-center">
              <div class="d-flex justify-space-around align-center">
                <mew-icon :icon-name="icon" :img-height="30" />
                <span class="capitalize pl-2 mew-heading-4">{{
                  gasPriceType
                }}</span>
              </div>
              <span
                v-if="!gettingFee && showFee"
                class="pl-2 mew-heading-4 textSecondary--text d-flex eth-fee"
                >{{ actualFeeFormatted }} {{ network.type.currencyName }}
              </span>
              <span
                v-if="!gettingFee && showFee"
                :class="[hasError ? 'error--text' : '', 'px-2 mew-heading-4']"
                >{{ feesInUsd }}</span
              >
              <v-skeleton-loader
                v-show="gettingFee || !showFee"
                type="text"
                width="150px"
                class="mb-n2 px-2"
              />
            </div>
          </v-col>

          <v-col v-if="!gettingFee || hasError" cols="12">
            <p :class="[hasError ? 'error--text' : '', 'mew-label mb-0']">
              {{ message }}
            </p>
          </v-col>
          <v-col cols="12" class="pt-0">
            <div class="d-flex align-center justify-start pt-2">
              <div
                class="mr-3 primary--text cursor--pointer user-select--none"
                @click="openHighFeeNote = true"
              >
                Why are the fees so high?
              </div>
              <a
                v-if="notEnoughEth"
                rel="noopener noreferrer"
                target="_blank"
                href="https://ccswap.myetherwallet.com/#/"
                >Buy more ETH</a
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
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
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';
import BigNumber from 'bignumber.js';
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
  name: 'SwapFee',
  components: { AppModal },
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
    openGasPriceModal: {
      type: Function,
      default: () => {}
    },
    gasPriceType: {
      type: String,
      default: 'economy'
    },
    message: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return { openHighFeeNote: false };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network']),
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
    }
  },
  methods: {
    closeHighFeeNote() {
      this.openHighFeeNote = false;
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
