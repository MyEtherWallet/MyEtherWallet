<template>
  <v-sheet color="transparent" max-width="600px">
    <!--
      =====================================================================================
        Values
      =====================================================================================
    -->
    <confirmation-values-container :items="valueItems" class="mb-5" />
    <!--
    =====================================================================================
      Summary
    =====================================================================================
    -->
    <confirmation-summary-block :items="summaryItems">
      <template #rightColItem0>
        <div class="mew-body">
          {{ feeFormatted }}
          <span class="greyPrimary--text"
            >{{ network.type.currencyName }}/</span
          >
          ~{{ txFeeUsd }}
        </div>
      </template>
      <template #rightColItem1>
        <div class="mew-body">
          {{ totalFee }}
          <span class="greyPrimary--text"
            >{{ network.type.currencyName }}/</span
          >
          ~{{ totalFeeUSD }}
        </div>
      </template>
    </confirmation-summary-block>
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toChecksumAddress } from '@/core/helpers/addressUtils';

export default {
  components: {
    ConfirmationSummaryBlock: () => import('./ConfirmationSummaryBlock'),
    ConfirmationValuesContainer: () => import('./ConfirmationValuesContainer')
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    network: {
      type: Object,
      default: () => {}
    },
    txFee: {
      type: String,
      default: '0'
    },
    txFeeUsd: {
      type: String,
      default: '0'
    },
    value: {
      type: String,
      default: '0'
    },
    toDetails: {
      type: Object,
      default: () => {}
    },
    /**
     * Decoded ERC-721/ERC-1155 transfer params, when this tx is an NFT
     * transfer. See confirmation/handlers/parseNftData.
     */
    nftData: {
      type: Object,
      default: null
    },
    sendCurrency: {
      type: Object,
      default: () => {}
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {};
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['getFiatValue']),
    currency() {
      const obj = Object.assign({}, this.sendCurrency);
      if (!obj.hasOwnProperty('amount')) obj['amount'] = this.value;
      if (!obj.hasOwnProperty('priceRaw'))
        obj['priceRaw'] = BigNumber(this.sendCurrency.price).toNumber();
      return obj;
    },
    isNetworkCurrency() {
      return this.currency.symbol === this.network.type.currencyName;
    },
    feeFormatted() {
      return formatFloatingPointValue(this.txFee).value;
    },
    totalFee() {
      if (this.currency.symbol === this.network.type.currencyName) {
        return formatFloatingPointValue(BigNumber(this.value).plus(this.txFee))
          .value;
      }
      return this.feeFormatted;
    },
    totalFeeUSD() {
      const rawTotalFee = BigNumber(this.value).plus(this.txFee);
      const ethFeeToUsd = BigNumber(this.txFee).times(this.value);
      if (this.currency.symbol === this.network.type.currencyName) {
        return this.getFiatValue(
          BigNumber(rawTotalFee).times(this.fiatValue).toFixed(2)
        );
      }
      const tokenPrice = BigNumber(this.currency.priceRaw).times(this.value);
      return this.getFiatValue(tokenPrice.plus(ethFeeToUsd));
    },
    usdAmount() {
      return this.getFiatValue(
        BigNumber(this.value).times(this.currency.priceRaw)
      );
    },
    summaryItems() {
      return this.isNetworkCurrency
        ? ['Transaction Fee', 'Total']
        : ['Transaction Fee'];
    },
    valueItems() {
      // An NFT transfer moves no native value, so the default tile would read
      // "0 ETH" and say nothing about what is actually leaving the wallet.
      // Show the token and quantity instead, and label the recipient plainly.
      const sending = this.nftData
        ? {
            label: 'Sending NFT',
            amount: this.nftData.amount ? this.nftData.amount : '1',
            usd: '',
            type: `${this.nftData.standard} · Token #${this.nftData.tokenId}`
          }
        : {
            amount: formatFloatingPointValue(this.currency.amount).value,
            icon: this.currency.img,
            usd: this.usdAmount,
            type: this.currency.symbol
          };
      return [
        sending,
        {
          label: this.nftData ? 'NFT recipient' : '',
          avatar: this.avatar,
          address: this.to ? toChecksumAddress(this.to) : '',
          nickname:
            this.toDetails && this.toDetails.nickname
              ? this.toDetails.nickname
              : '',
          ensName:
            this.toDetails && this.toDetails.ensName
              ? this.toDetails.ensName
              : ''
        }
      ];
    }
  }
};
</script>
