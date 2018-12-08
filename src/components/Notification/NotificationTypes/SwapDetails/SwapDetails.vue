<template lang="html">
  <div>
    <div class="notification-header">
      Swap Detail
      <!--
        <div class="notification-type-status">
          <p class="type">Transaction Detail</p>
        </div>
      -->
    </div>
    <div class="notification-content">
      <ul>
        <li>
          <ul>
            <li>
              <p class="icon from-swap-icon">
                <i :class="['cc', details.fromCurrency, 'cc-icon']"></i>
              </p>
            </li>
            <li>
              <p class="from-swap-text">
                {{ details.fromValue }} {{ details.fromCurrency }}
              </p>
              <p class="address">{{ details.from | concatAddress }}</p>
            </li>
            <li>
              <p class="swap-right-arrow"><img :src="arrowImage" /></p>
            </li>
            <li>
              <p class="icon to-swap-icon">
                <i :class="['cc', details.toCurrency, 'cc-icon']"></i>
              </p>
            </li>
            <li>
              <p class="to-swap-text">
                {{ details.toValue }} {{ details.toCurrency }}
              </p>
              <p class="address">{{ details.from | concatAddress }}</p>
            </li>
          </ul>
        </li>

        <li>
          <p>Transaction Hash:</p>
          <div class="detail-data">
            <p>
              <a :href="hashLink" target="_blank"> {{ notice.hash }} </a>
            </p>
          </div>
        </li>
        <li>
          <p>Time:</p>
          <div class="time-date">
            <p>{{ timeString(notice) }}</p>
            <p>{{ dateString(notice) }}</p>
          </div>
        </li>
        <li>
          <p>Time Remaining:</p>
          <div class="detail-data">
            <p>{{ convertToEth(details.timeRemaining) }}</p>
          </div>
        </li>
        <li class="notification-type-status">
          <p>Status:</p>
          <div class="detail-data">
            <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
          </div>
        </li>
        <li>
          <p>Amount:</p>
          <div class="detail-data">
            <p>{{ convertToEth(details.amount) }} ETH</p>
          </div>
        </li>
        <li>
          <p>To Address:</p>
          <div class="detail-data">
            <p>
              <a :href="addressLink" target="_blank"> {{ details.to }} </a>
            </p>
          </div>
        </li>
        <li>
          <p>TX Fee:</p>
          <div class="detail-data">
            <p>
              {{ convertToEth(details.gasPrice * details.gasLimit) }} ETH (${{
                getFiatValue(details.gasPrice * details.gasLimit)
              }})
            </p>
          </div>
        </li>
        <li>
          <p>Gas Price:</p>
          <div class="detail-data">
            <p>{{ convertToGwei(details.gasPrice) }} Gwei</p>
          </div>
        </li>
        <li>
          <p>Gas Limit:</p>
          <div class="detail-data">
            <p>{{ details.gasLimit }}</p>
          </div>
        </li>
        <li v-if="txStatus.text === 'Succeed'">
          <p>Gas Used:</p>
          <div class="detail-data">
            <p>
              {{ details.gasUsed }} (${{
                getFiatValue(details.gasPrice * details.gasUsed)
              }})
            </p>
          </div>
        </li>
        <li>
          <p>Nonce:</p>
          <div class="detail-data">
            <p>{{ details.nonce }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';
import unit from 'ethjs-unit';
import BigNumber from 'bignumber.js';

import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import Arrow from '@/assets/images/etc/single-arrow.svg';

import {
  swapOnlyStatuses,
  notificationStatuses
} from '@/helpers/notificationFormatter';

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
    getProvider: {
      type: Function,
      default: function() {}
    },
    childUpdateNotification: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      arrowImage: Arrow,
      unreadCount: 0
    };
  },
  filters: {
    concatAddress(value) {
      if (!value) return '';
      return `${value.substr(0, 7)}...${value.substr(value.length - 7)}`;
    }
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    hashLink() {
      if (this.network.type.blockExplorerTX) {
        return this.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          this.notice.hash
        );
      }
    },
    addressLink() {
      if (this.network.type.blockExplorerAddr) {
        return this.network.type.blockExplorerAddr.replace(
          '[[address]]',
          this.notice.body.to
        );
      }
    },
    details() {
      return this.notice.body;
    },
    txStatus() {
      const status = {
        pending: { text: 'Processing', class: 'status-processing' },
        complete: { text: 'Succeed', class: 'status-succeed' },
        failed: { text: 'Failed', class: 'status-failed' },
        error: { text: 'Display Error', class: 'status-failed' }
      };

      if (status[this.notice.status]) {
        return status[this.notice.status];
      }
      return status.error;
    }
  },
  beforeDestroy() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
    }

    if (this.statusInterval !== null) {
      clearInterval(this.statusInterval);
    }
  },
  mounted() {
    this.provider = this.getProvider(this.notice.body.provider);
    this.currentStatus = this.notice.swapStatus;
    this.timeUpdater();
    this.statusUpdater();
    console.log(this.notice); // todo remove dev item
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['swap', this.notice]);
    },
    shouldCheckStatus() {
      return [notificationStatuses.NEW, notificationStatuses.PENDING].includes(
        this.notice.swapStatus
      ) /*|| this.details.timeRemaining > 0*/;
    },
    statusUpdater() {
      // NOTE: if active then should get checked even after time expires
      // eslint-disable-next-line
      console.log('statusUpdater started'); // todo remove dev item
      let updating = false;
      const getStatus = async () => {
        if (!updating) {
          updating = true;
          const newStatus = await this.getProvider(
            this.notice.body.provider
          ).getOrderStatus(this.details, this.network.type.name);
          console.log(newStatus); // todo remove dev item
          if (this.currentStatus !== newStatus) {
            this.currentStatus = newStatus;
            if (Object.values(swapOnlyStatuses).includes(newStatus)) {
              this.notice.swapStatus = newStatus;
            } else {
              this.notice.swapStatus = newStatus;
              this.notice.status = newStatus;
            }
            this.childUpdateNotification(this.notice);
          }
          if (this.shouldCheckStatus()) {
            clearInterval(this.statusInterval);
          }
          updating = false;
        }
      };

      if (this.shouldCheckStatus()) {
        getStatus();
        this.statusInterval = setInterval(() => {
          getStatus();
          if (!this.shouldCheckStatus()) {
            clearInterval(this.statusInterval);
          }
        }, 1000);
      }
    },
    timeUpdater() {
      const updateTime = () => {
        this.timeRemaining = this.calculateTimeRemaining(this.details);
        if (
          this.notice.swapStatus === swapOnlyStatuses.NEW &&
          this.timeRemaining <= 0
        ) {
          this.notice.swapStatus = swapOnlyStatuses.CANCELLED;
          this.notice.status = notificationStatuses.FAILED;
          this.timeRemaining = -1;
        }
        this.notice.body.timeRemaining = this.timeRemaining;
        this.childUpdateNotification(this.notice);
      };

      if (this.shouldCheckStatus()) {
        updateTime();
        this.timerInterval = setInterval(() => {
          updateTime();
          if (this.timeRemaining < 0) {
            clearInterval(this.timerInterval);
          }
        }, 1000);
      }
    },
    calculateTimeRemaining(details) {
      return (
        details.timeRemaining -
        parseInt(
          (new Date().getTime() - new Date(details.createdAt).getTime()) / 1000
        )
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapDetails';
</style>
