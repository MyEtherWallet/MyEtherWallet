<template lang="html">
  <div>
    <div class="notification-header">{{ $t('swap.detail') }}</div>
    <div class="notification-content">
      <ul>
        <li>
          <!-- Change to use provider logo-->
          <p>{{ $tc('swap.providers.string', 1) }}:</p>
          <div class="detail-data">
            <p>
              {{ details.provider }}
            </p>
          </div>
        </li>
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
              <p v-if="!isFromOtherChain" class="address">
                {{ details.from | concatAddress }}
              </p>
            </li>
            <li>
              <p class="swap-right-arrow"><img :src="arrowImage" alt /></p>
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
              <p class="address">{{ details.to | concatAddress }}</p>
            </li>
          </ul>
        </li>
        <li>
          <p>{{ $t('common.time') }}:</p>
          <div class="time-date">
            <p>{{ timeString(notice) }}</p>
            <p>{{ dateString(notice) }}</p>
          </div>
        </li>
        <li
          v-if="
            notice.type === notificationType.SWAP_ORDER && timeRemaining > 0
          "
        >
          <p>{{ $t('common.time-remain') }}:</p>
          <div class="detail-data">
            <p>{{ parseTimeRemaining }}</p>
          </div>
        </li>
        <li class="notification-type-status">
          <p>{{ $t('common.status') }}:</p>
          <div class="detail-data">
            <p :class="['status', txStatus.class]">({{ $t(txStatus.text) }})</p>
          </div>
        </li>
        <li v-if="isEthereum">
          <p>{{ $t('sendTx.to-addr') }}:</p>
          <div class="detail-data">
            <p>
              <a
                :href="addressLink(details.to, details.toCurrency)"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ details.to }}
              </a>
            </p>
          </div>
        </li>
        <li v-if="isFromOtherChain">
          <p>
            {{
              $t('swap.deposit-addr', {
                provider: notice.body.provider
              })
            }}:
          </p>
          <div class="detail-data">
            <p>
              <a
                :href="
                  addressLink(details.providerAddress, details.fromCurrency)
                "
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ details.providerAddress }}
              </a>
            </p>
          </div>
        </li>
        <li v-if="showId && details.orderId">
          <p>
            {{
              $t('swap.order-id', {
                provider: notice.body.provider
              })
            }}:
          </p>
          <div class="detail-data">
            <p>
              {{ details.orderId }}
            </p>
          </div>
        </li>
        <li v-if="notice.body.gasUsed && isEthereum">
          <p>{{ $t('sendTx.tx-fee') }}:</p>
          <div class="detail-data">
            <p>
              {{ convertToEth(details.gasPrice * details.gasUsed) }}
              {{ $t('common.currency.eth') }} (${{
                getFiatValue(details.gasPrice * details.gasUsed)
              }})
            </p>
          </div>
        </li>
        <li v-if="isEthereum">
          <p>{{ $t('sendTx.max-tx-fee') }}:</p>
          <div class="detail-data">
            <p>
              {{ convertToEth(details.gasPrice * details.gasLimit) }}
              {{ $t('common.currency.eth') }} (${{
                getFiatValue(details.gasPrice * details.gasLimit)
              }})
            </p>
          </div>
        </li>
        <li v-if="isEthereum">
          <p>{{ $t('common.gas.price') }}:</p>
          <div class="detail-data">
            <p>
              {{ convertToGwei(details.gasPrice) }} {{ $t('common.gas.gwei') }}
            </p>
          </div>
        </li>
        <li v-if="isEthereum">
          <p>{{ $t('common.gas.limit') }}:</p>
          <div class="detail-data">
            <p>{{ details.gasLimit }}</p>
          </div>
        </li>
        <li v-if="notice.hash">
          <p>{{ $t('sendTx.tx-hash') }}:</p>
          <div class="detail-data">
            <p>
              <a
                :href="hashLink(notice.hash)"
                rel="noopener noreferrer"
                target="_blank"
              >
                {{ notice.hash }}
              </a>
            </p>
          </div>
        </li>
        <li v-if="isError">
          <p>{{ $t('common.error-message') }}:</p>
          <div class="detail-data">
            <p>{{ errorMessage }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import Arrow from '@/assets/images/etc/single-arrow.svg';

import { providerMap, providerNames, fiat, EthereumTokens } from '@/partners';

import {
  swapOnlyStatuses,
  notificationStatuses,
  type as notificationType
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
    },
    childUpdateNotification: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      providerNames: providerNames,
      timerInterval: null,
      statusInterval: null,
      arrowImage: Arrow,
      timeRemaining: 0,
      unreadCount: 0,
      fiatCurrencies: fiat.map(entry => entry.symbol),
      notificationType: notificationType
    };
  },
  computed: {
    ...mapState('main', [
      'web3',
      'network',
      'notifications',
      'wallet',
      'gasPrice'
    ]),
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
      return this.processStatus(this.notice.swapStatus);
    },
    parseTimeRemaining() {
      const seconds = Math.floor(this.timeRemaining % 60);
      const minutes = Math.floor((this.timeRemaining / 60) % 60);
      return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
    },
    isEthereum() {
      return EthereumTokens[this.notice.body.fromCurrency] !== undefined;
    },
    isToOtherChain() {
      return EthereumTokens[this.notice.body.toCurrency] === undefined;
    },
    isFromOtherChain() {
      return EthereumTokens[this.notice.body.fromCurrency] === undefined;
    },
    isFromFiat() {
      return this.fiatCurrencies.includes(this.notice.body.fromCurrency);
    },
    showId() {
      return (
        this.notice.body.provider === providerNames.bity ||
        this.notice.body.provider === providerNames.changelly
      );
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
    this.timeRemaining = this.notice.body.timeRemaining;
    this.provider = providerMap.get(this.notice.body.provider);
    this.currentStatus = this.notice.swapStatus;
    this.timeUpdater();
    this.statusUpdater();
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['swap', this.notice]);
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
        }, 10000);
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
@import 'SwapDetails';
</style>
