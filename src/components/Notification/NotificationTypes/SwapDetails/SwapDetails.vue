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
            <p>{{ parseTimeRemaining }}</p>
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
              <a :href="addressLink(details.to)" target="_blank">
                {{ details.to }}
              </a>
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

import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import Arrow from '@/assets/images/etc/single-arrow.svg';

import { providerMap } from '@/partners';

import {
  swapOnlyStatuses,
  notificationStatuses
} from '@/helpers/notificationFormatter';

export default {
  filters: {
    concatAddress(value) {
      if (!value) return '';
      return `${value.substr(0, 7)}...${value.substr(value.length - 7)}`;
    }
  },
  props: {
    shown: {
      type: Boolean,
      default: false
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
    },
    childUpdateNotification: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      timerInterval: null,
      statusInterval: null,
      arrowImage: Arrow,
      timeRemaining: 0,
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
    details() {
      return this.notice.body;
    },
    txStatus() {
      return this.processStatus(this.notice.status);
    },
    parseTimeRemaining() {
      const seconds = Math.floor(this.timeRemaining % 60);
      const minutes = Math.floor((this.timeRemaining / 60) % 60);
      return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
    }
  },
  watch: {
    shown(val) {
      console.log('shown:', val); // todo remove dev item
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
    this.provider = providerMap.get(this.notice.body.provider);
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
          const newStatus = await this.provider.getOrderStatus(
            this.details,
            this.network.type.name
          );
          if (this.currentStatus !== newStatus) {
            console.log(newStatus); // todo remove dev item
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
        const timeRemaining =
          this.details.validFor -
          parseInt(
            (new Date().getTime() -
              new Date(this.details.createdAt).getTime()) /
              1000
          );
        this.timeRemaining = timeRemaining;
        if (
          this.notice.swapStatus === swapOnlyStatuses.NEW &&
          timeRemaining <= 0
        ) {
          this.notice.swapStatus = swapOnlyStatuses.CANCELLED;
          this.notice.status = notificationStatuses.FAILED;
          this.timeRemaining = -1;
        }
        this.notice.body.timeRemaining = this.timeRemaining;
        this.childUpdateNotification(this.notice);

        if (timeRemaining < 0) {
          clearInterval(this.timerInterval);
        }
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
