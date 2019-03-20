<template lang="html">
  <div>
    <div class="notification-header">{{ $t('header.transactionDetail') }}</div>
    <div class="notification-content">
      <ul>
        <li>
          <p>{{ $t('header.time') }}:</p>
          <div class="time-date">
            <p>{{ timeString(notice) }}</p>
            <p>{{ dateString(notice) }}</p>
          </div>
        </li>
        <li class="notification-type-status">
          <p>{{ $t('header.status') }}:</p>
          <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
        </li>
        <li>
          <p>{{ $t('header.amount') }}:</p>
          <p>{{ convertToEth(details.amount) }} {{ network.type.name }}</p>
        </li>
        <li>
          <p>{{ $t('common.toAddress') }}:</p>
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
          <p>{{ $t('common.gasPrice') }}:</p>
          <p>{{ convertToGwei(details.gasPrice) }} Gwei</p>
        </li>
        <li>
          <p>{{ $t('common.gasLimit') }}:</p>
          <p>{{ details.gasLimit }}</p>
        </li>
        <li v-if="notice.body.gasUsed">
          <p>{{ $t('common.txFee') }}:</p>
          <p>
            {{ convertToEth(details.gasPrice * details.gasUsed) }}
            {{ network.type.name }} (${{
              getFiatValue(details.gasPrice * details.gasUsed)
            }})
          </p>
        </li>
        <li>
          <p>{{ $t('header.maxTxFee') }}:</p>
          <p>
            {{ convertToEth(details.gasPrice * details.gasLimit) }}
            {{ network.type.name }} (${{
              getFiatValue(details.gasPrice * details.gasLimit)
            }})
          </p>
        </li>
        <li>
          <p>{{ $t('header.nonce') }}:</p>
          <p>{{ details.nonce }}</p>
        </li>
        <li v-if="notice.hash">
          <p>{{ $t('header.transactionHash') }}:</p>
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
          <p>{{ $t('header.errorMessage') }}:</p>
          <p>{{ errorMessage }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    errorMessage() {
      return this.errorMessageString(this.notice);
    },
    isError() {
      return this.notice.body.error;
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
