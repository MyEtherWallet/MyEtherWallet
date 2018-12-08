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

import { providers } from '@/partners';

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
    // getProvider: {
    //   type: Function,
    //   default: function() {}
    // },
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
      provider: {},
      timerInterval: {},
      statusInterval: {}
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
      console.log('expanded'); // todo remove dev item
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
    this.provider = providers.find(entry => {
      console.log(entry.getName()); // todo remove dev item
      return entry.getName() === this.notice.provider;
    });
    console.log('this.provider name', this.notice.body.provider); // todo remove dev item

    console.log('this.provider', this.provider); // todo remove dev item
    this.currentStatus = this.notice.status;
    this.timeUpdater();
    this.statusUpdater();
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['swap', this.notice, this.index]);
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
      const currentProvider = providers.find(
        entry => entry.getName() === this.notice.provider
      );
      console.log('currentProvider', currentProvider); // todo remove dev item
      const getStatus = async () => {
        if (!updating) {
          updating = true;
          console.log(this.notice.body.provider); // todo remove dev item
          console.log(this.getProvider); // todo remove dev item
          const newStatus = await currentProvider.getOrderStatus(
            this.details,
            this.network
          );
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
          this.notice.timeRemaining <= 0
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
    },
    getProvider(provider) {
      console.log(provider); // todo remove dev item
      if (providers[provider]) {
        console.log('provider', providers[provider]); // todo remove dev item
        return providers.find(entry => {
          return entry.getName() === provider;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './SwapNotification.scss';
</style>
