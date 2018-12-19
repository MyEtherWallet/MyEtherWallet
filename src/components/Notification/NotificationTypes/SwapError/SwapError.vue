<template lang="html">
  <div>
    <div class="notification-header" @click="expand()">
      <div class="notification-type-status">
        <p class="type">Swap</p>
        <p :class="['status', txStatus.class]">({{ txStatus.text }})</p>
      </div>
      <div class="time-date">
        <p>{{ timeString(notice) }}</p>
        <p>{{ dateString(notice) }}</p>
        <div class="expender-icon">
          <i aria-hidden="true" class="fa fa-angle-down"></i>
          <i aria-hidden="true" class="fa fa-angle-up"></i>
        </div>
      </div>
    </div>
    <div
      :class="[
        notice.expanded ? '' : 'unexpanded',
        'notification-body',
        'notification-content'
      ]"
    >
      <ul>
        <li class="swap-details">
          <ul>
            <li>
              <p class="icon from-swap-icon">
                <i :class="['cc', notice.body.fromCurrency, 'cc-icon']"></i>
              </p>
            </li>
            <li>
              <p class="from-swap-text">
                {{ notice.body.fromValue }} {{ notice.body.fromCurrency }}
              </p>
              <p class="address">{{ notice.body.from | concatAddress }}</p>
            </li>
            <li>
              <p class="swap-right-arrow"><img :src="arrowImage" /></p>
            </li>
            <li>
              <p class="icon to-swap-icon">
                <i :class="['cc', notice.body.toCurrency, 'cc-icon']"></i>
              </p>
            </li>
            <li>
              <p class="to-swap-text">
                {{ notice.body.toValue }} {{ notice.body.toCurrency }}
              </p>
              <p class="address">{{ notice.body.from | concatAddress }}</p>
            </li>
          </ul>
        </li>
        <li v-if="notice.body.errorMessage" class="tx-hash">
          <p>Error Message:</p>
          <p>{{ notice.body.errorMessage }}</p>
        </li>
        <li class="tx-hash"><p>Transaction Hash:</p></li>
        <li v-if="notice.hash" class="tx-hash">
          <a :href="hashLink(notice.hash)" target="_blank">
            {{ notice.hash }}
          </a>
        </li>
        <li><p @click="emitShowDetails">More</p></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import Arrow from '@/assets/images/etc/single-arrow.svg';

import { providerMap, providerNames } from '@/partners';

import {
  swapOnlyStatuses,
  notificationStatuses
} from '@/helpers/notificationFormatters';

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
    expand: {
      type: Function,
      default: function() {}
    },
    index: {
      type: Number,
      default: 0
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
      arrowImage: Arrow,
      unreadCount: 0,
      currentStatus: '',
      swapStatus: '',
      timeRemaining: this.notice.body.timeRemaining,
      providers: providerMap,
      provider: {},
      timerInterval: null,
      statusInterval: null
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    txStatus() {
      return this.processStatus(this.notice.swapStatus);
    },
    parseTimeRemaining() {
      const seconds = Math.floor(this.timeRemaining % 60);
      const minutes = Math.floor((this.timeRemaining / 60) % 60);
      return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
    },
    timeRemains() {
      return this.timeRemaining > 0;
    }
  },
  watch: {
    shown(val) {
      if (val) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    }
  },
  activated() {
    if (this.shown) {
      this.startPolling();
    }
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['swap', this.notice, this.index]);
    },
    startPolling() {
      if (this.notice.body.provider === providerNames.kyber) return;

      this.provider = providerMap.get(this.notice.body.provider);
      this.currentStatus = this.notice.status;

      if (this.timerInterval === null) {
        this.timeUpdater();
      }

      if (this.statusInterval === null) {
        this.statusUpdater();
      }
    },
    stopPolling() {
      if (this.timerInterval !== null) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      if (this.statusInterval !== null) {
        clearInterval(this.statusInterval);
        this.statusInterval = null;
      }
    },
    shouldCheckStatus() {
      return [
        swapOnlyStatuses.NEW,
        swapOnlyStatuses.SENT,
        notificationStatuses.PENDING
      ].includes(this.notice.swapStatus);
    },
    statusUpdater() {
      let updating = false;
      const getStatus = async () => {
        if (!updating) {
          updating = true;
          const newStatus = await this.provider.getOrderStatus(
            this.notice.body,
            this.network.type.name
          );
          if (typeof newStatus === 'undefined') return;
          if (this.currentStatus !== newStatus) {
            this.currentStatus = newStatus;
            if (swapOnlyStatuses[newStatus]) {
              this.notice.swapStatus = newStatus;
            } else {
              this.notice.swapStatus = newStatus;
              this.notice.status = newStatus;
            }
            this.childUpdateNotification(this.notice);
          }

          if (!this.shouldCheckStatus()) {
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
        }, 2500);
      }
    },
    timeUpdater() {
      const updateTime = () => {
        this.timeRemaining =
          this.notice.body.validFor -
          parseInt(
            (new Date().getTime() -
              new Date(this.notice.body.createdAt).getTime()) /
              1000
          );
        if (
          (this.notice.swapStatus === swapOnlyStatuses.NEW ||
            this.currentStatus === swapOnlyStatuses.NEW) &&
          this.timeRemaining <= 0
        ) {
          this.notice.swapStatus = swapOnlyStatuses.CANCELLED;
          this.notice.status = notificationStatuses.FAILED;
          this.notice.body.errorMessage =
            'Swap window timeout. Swap Cancelled.';
          this.timeRemaining = -1;
        }
        this.notice.body.timeRemaining = +this.timeRemaining;
        this.childUpdateNotification(this.notice);
        if (+this.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
        }
      };

      if (this.shouldCheckStatus() && this.notice.body.timeRemaining > 0) {
        if (this.timeRemaining > 0) {
          updateTime();
          this.timerInterval = setInterval(() => {
            updateTime();
            if (this.timeRemaining <= 0) {
              clearInterval(this.timerInterval);
            }
          }, 1000);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './SwapError.scss';
</style>
