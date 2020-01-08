<template lang="html">
  <div>
    <div class="notification-header">{{ $t('sendTx.tx-detail') }}</div>
    <div class="notification-content">
      <ul>
        <li>
          <p>{{ $t('common.time') }}:</p>
          <div class="time-date">
            <p>{{ timeString(notice) }}</p>
            <p>{{ dateString(notice) }}</p>
          </div>
        </li>
        <li class="notification-type-status">
          <p>{{ $t('common.status') }}:</p>
          <p :class="['status', txStatus.class]">({{ $t(txStatus.text) }})</p>
        </li>
        <li v-if="isTokenTransfer">
          <p>{{ $t('sendTx.amount') }}:</p>
          <p>{{ details.tokenTransferVal }} {{ details.tokenSymbol }}</p>
        </li>
        <li v-if="!isTokenTransfer">
          <p>{{ $t('sendTx.amount') }}:</p>
          <p>{{ convertToEth(details.amount) }} {{ network.type.name }}</p>
        </li>
        <li>
          <p>{{ $t('sendTx.to-addr') }}:</p>
          <p>
            <a
              :href="addressLink(details.tokenTransferTo || details.to)"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ details.tokenTransferTo || details.to }}
            </a>
          </p>
        </li>
        <li v-if="isTokenTransfer">
          <p>{{ $t('sendTx.via-contract') }}:</p>
          <p>
            <a
              :href="addressLink(details.to)"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ details.to }}
            </a>
          </p>
        </li>
        <li>
          <p>{{ $t('common.gas.price') }}:</p>
          <p>
            {{ convertToGwei(details.gasPrice) }} {{ $t('common.gas.gwei') }}
          </p>
        </li>
        <li>
          <p>{{ $t('common.gas.limit') }}:</p>
          <p>{{ details.gasLimit }}</p>
        </li>
        <li v-if="notice.body.gasUsed">
          <p>{{ $t('sendTx.tx-fee') }}:</p>
          <p>
            {{ convertToEth(details.gasPrice * details.gasUsed) }}
            {{ network.type.name }} (${{
              getFiatValue(details.gasPrice * details.gasUsed)
            }})
          </p>
        </li>
        <li>
          <p>{{ $t('sendTx.max-tx-fee') }}:</p>
          <p>
            {{ convertToEth(details.gasPrice * details.gasLimit) }}
            {{ network.type.name }} (${{
              getFiatValue(details.gasPrice * details.gasLimit)
            }})
          </p>
        </li>
        <li>
          <p>{{ $t('sendTx.nonce') }}:</p>
          <p>{{ details.nonce }}</p>
        </li>
        <li v-if="notice.hash">
          <p>{{ $t('sendTx.tx-hash') }}:</p>
        </li>
        <li v-if="notice.hash">
          <p>
            <a
              :href="hashLink(notice.hash)"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ notice.hash }}
            </a>
          </p>
        </li>
        <li v-if="isError">
          <p>{{ $t('common.error-message') }}:</p>
          <p>{{ errorMessage }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    notice: {
      type: Object,
      default: function() {
        return {};
      }
    },
    convertToGwei: {
      type: Function,
      default: function() {}
    },
    convertToEth: {
      type: Function,
      default: function() {}
    },
    getFiatValue: {
      type: Function,
      default: function() {}
    },
    dateString: {
      type: Function,
      default: function() {}
    },
    timeString: {
      type: Function,
      default: function() {}
    },
    errorMessageString: {
      type: Function,
      default: function() {}
    },
    hashLink: {
      type: Function,
      default: function() {}
    },
    addressLink: {
      type: Function,
      default: function() {}
    },
    processStatus: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      unreadCount: 0
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'notifications', 'wallet']),
    errorMessage() {
      return this.errorMessageString(this.notice);
    },
    isError() {
      return this.notice.body.error;
    },
    isTokenTransfer() {
      return (
        this.notice.body.tokenTransferTo !== undefined &&
        this.notice.body.tokenTransferTo !== null
      );
    },
    details() {
      return this.notice.body;
    },
    txStatus() {
      return this.processStatus(this.notice.status);
    }
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Notification';
</style>
