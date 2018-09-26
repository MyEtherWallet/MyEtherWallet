<template>
  <div>
    <div class="ens-name">
      <h2>{{ ens.name }}.eth</h2>
    </div>
    <div class="detail-info">
      <div class="detail-info-item">
        <span class="detail-title">Actual Bid Amount</span>
        <span class="detail-value">{{ ens.bidAmount }} ETH</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-title">Secret Phrase</span>
        <span class="detail-value">{{ ens.secretPhrase }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-title">Reveal Date</span>
        <span class="detail-value">{{ formatDate(ens.revealDate) }}</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-title">Bid Mask</span>
        <span class="detail-value">{{ ens.bidMask }} ETH</span>
      </div>
      <div class="detail-info-item">
        <span class="detail-title">Auction Ends</span>
        <span class="detail-value">{{ formatDate(ens.auctionDateEnd) }}</span>
      </div>
      <div>
        <div class="json-container">
          <span class="json-title">JSON String</span>
          <span
            class="json-copy"
            @click="copyString">{{ $t('common.copy') }}</span>
        </div>
        <textarea
          ref="json"
          v-model="jsonText"
          class="json-content" />
      </div>
    </div>
    <div class="button-container">
      <button
        type="button"
        class="cancel-button"
        name="button"
        @click="back">Back</button>
      <button
        type="button"
        class="submit-button"
        name="button"
        @click="sendTx">{{ $t('common.confirmAndSave') }}</button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
const unit = require('ethjs-unit');
import { Misc } from '@/helpers';
export default {
  props: {
    ens: {
      type: Object,
      default: function() {
        return {};
      }
    },
    back: {
      type: Function,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      jsonText: '',
      formatDate: Misc.formatDate
    };
  },
  watch: {
    ens(val) {
      this.jsonText = JSON.stringify({
        name: val.name,
        nameSHA3: val.nameSHA3,
        bidAmount: val.bidAmount,
        bidMask: val.bidMask,
        value: this.$store.state.web3.utils.toWei(
          val.bidAmount.toString(),
          'ether'
        ),
        secretPhrase: val.secretPhrase,
        secretPhraseSHA3: val.secretPhraseSHA3
      });
    }
  },
  methods: {
    sendTx() {},
    copyString() {
      this.$refs['json'].select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmContainer.scss';
</style>
