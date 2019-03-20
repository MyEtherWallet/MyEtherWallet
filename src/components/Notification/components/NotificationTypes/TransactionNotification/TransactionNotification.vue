<template lang="html">
  <div>
    <notification-header
      :expand="expand"
      :notice="notice"
      :process-status="processStatus"
      :time-string="timeString"
      :date-string="dateString"
    >
    </notification-header>
    <div
      :class="[
        notice.expanded ? '' : 'unexpanded',
        'notification-body',
        'notification-content'
      ]"
    >
      <ul>
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
        <li v-if="isContractCreation">
          <p>{{ $t('common.createdContract') }}:</p>
          <p>
            <a
              :href="addressLink(details.contractAddress)"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ details.contractAddress }}
            </a>
          </p>
        </li>
        <li v-if="notice.body.gasUsed">
          <p>{{ $t('common.txFee') }}:</p>
          <p>
            {{ convertToEth(details.gasPrice * details.gasUsed) }}
            {{ network.type.name }}
            <span>
              (${{ getFiatValue(details.gasPrice * details.gasUsed) }})
            </span>
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
        <li v-if="notice.hash">
          <p>{{ $t('header.transactionHash') }}:</p>
        </li>
        <li v-if="notice.hash">
          <a
            :href="hashLink(notice.hash)"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ notice.hash }}
          </a>
        </li>
        <li v-if="isError">
          <p>{{ $t('header.errorMessage') }}:</p>
          <p>{{ errorMessage }}</p>
        </li>
        <li class="show-pointer" @click="emitShowDetails">
          {{ $t('header.more') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationHeader from '../../NotificationHeader';

export default {
  components: {
    'notification-header': NotificationHeader
  },
  props: {
    expand: {
      type: Function,
      default: function() {}
    },
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
    processStatus: {
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
    isContractCreation() {
      return (
        this.notice.body.contractAddress !== undefined &&
        this.notice.body.contractAddress !== null
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
      this.$emit('showDetails', ['transaction', this.notice]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TransactionNotification';
</style>
