<template lang="html">
  <div>
    <div class="notification-header" @click="expand();">
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
        <li>
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
        <li>
          <p>Time Remaining:</p>
          <p>{{ parseTimeRemaining }}</p>
        </li>
        <li><p @click="emitShowDetails">More</p></li>
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

import { providers, providerMap } from '@/partners';

import {
  swapOnlyStatuses,
  notificationStatuses
} from '@/helpers/notificationFormatter';

export default {
  props: {
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
      timeRemaining: 1,
      providers: providerMap,
      provider: {},
      timerInterval: null,
      statusInterval: null
    };
  },
  filters: {
    concatAddress(value) {
      if (!value) return '';
      return `${value.substr(0, 7)}...${value.substr(value.length - 7)}`;
    }
  },
  watch: {
    ['notice.expanded']() {
      this.statusUpdater();
      this.timeUpdater();
    }
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
    this.currentStatus = this.notice.status;
    this.timeUpdater();
    this.statusUpdater();
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['swap', this.notice, this.index]);
    },
    shouldCheckStatus() {
      return (
        [notificationStatuses.NEW, notificationStatuses.PENDING].includes(
          this.notice.swapStatus
        ) && this.notice.status === notificationStatuses.PENDING
      );
    },
    statusUpdater() {
      // NOTE: if active then should get checked even after time expires
      // eslint-disable-next-line

      let updating = false;
      const getStatus = async () => {
        console.log('statusUpdater start'); // todo remove dev item
        if (!updating) {
          console.log('statusUpdater run'); // todo remove dev item
          updating = true;
          const newStatus = await this.provider.getOrderStatus(
            this.notice.body,
            this.network.type.name
          );
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
        const timeRemaining =
          this.details.validFor -
          parseInt(
            (new Date().getTime() -
              new Date(this.details.createdAt).getTime()) /
              1000
          );
        this.timeRemaining = +timeRemaining;
        if (
          this.notice.swapStatus === swapOnlyStatuses.NEW &&
          this.notice.timeRemaining <= 0
        ) {
          this.notice.swapStatus = swapOnlyStatuses.CANCELLED;
          this.notice.status = notificationStatuses.FAILED;
          this.notice.body.errorMessage =
            'Swap window timeout. Swap Cancelled.';
          this.timeRemaining = -1;
        }
        this.notice.body.timeRemaining = +timeRemaining;
        // this.childUpdateNotification(this.notice);
        if (+timeRemaining < 0) {
          this.childUpdateNotification(this.notice);
          clearInterval(this.timerInterval);
        }
      };

      if (this.shouldCheckStatus()) {
        if (this.timeRemaining > 0) {
          updateTime();
          this.timerInterval = setInterval(() => {
            updateTime();
            if (this.timeRemaining < 0) {
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
@import './SwapNotification.scss';
</style>
