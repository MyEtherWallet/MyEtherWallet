<template>
  <!--
    ===================================================
    Staked Status Tab
    ===================================================
    -->
  <div class="staked-status-container mx-auto">
    <!--
    ===================================================
    Loading
    ===================================================
    -->
    <div v-if="loading">
      <v-skeleton-loader width="150px" type="list-item" />
      <v-skeleton-loader
        v-for="idx in 3"
        :key="idx"
        class="mb-4"
        height="100px"
        type="image"
      />
    </div>
    <div v-if="!loading">
      <!--
    ===================================================
    No Validators: 
    ===================================================
    -->
      <div v-if="validators.length === 0 && justStakedValidator.length === 0">
        You are currently not staking any eth.
      </div>
      <!--
    ===================================================
    Pending Validators
    ===================================================
    -->
      <div v-if="allPendingValidators.length > 0" class="pb-8">
        <span class="mew-heading-3">Pending</span>
        <div
          v-for="(pending, idx) in allPendingValidators"
          :key="pending + idx"
          class="
            mt-4
            d-flex
            flex-column
            align-center
            cursor-pointer
            justify-space-between
          "
          @click="expand(idx)"
        >
          <!--
    ===================================================
    Pending Validators (Header)
    ===================================================
    -->
          <div
            :class="[
              'rounded-t-lg header-container tableHeader pa-5 full-width d-flex flex-row align-center justify-space-between',
              isExpanded(idx) ? 'rounded-t-lg' : 'rounded-lg'
            ]"
          >
            <div class="left-container d-flex">
              <img :src="iconETHNavy" height="22" alt="ethereum" />
              <div class="ml-3">
                <div class="mew-heading-3">
                  {{ pending.amount }} <span class="mew-caption">ETH</span>
                </div>
                <div class="textPrimary--text mt-1">
                  {{ '$' + pending.amountFiat }}
                </div>
              </div>
            </div>
            <div>
              <v-progress-circular
                size="18"
                width="2"
                color="primary"
                indeterminate
              />
              <v-icon class="ml-5" color="searchText" size="22">{{
                isExpanded(idx) ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </div>
          </div>
          <!--
    ===================================================
    Pending Validators (Details Expanded)
    ===================================================
    -->
          <div
            v-if="isExpanded(idx)"
            class="border-container rounded-b-lg full-width pa-5"
          >
            <div class="mt-5 mb-8 font-weight-bold">More Info</div>
            <!--
    ===================================================
    Pending Status (Created - Processing)
    ===================================================
    -->
            <div
              v-if="pending.status.toLowerCase() === STATUS_TYPES.CREATED"
              class="d-flex"
            >
              <v-progress-circular
                class="ml-4"
                size="18"
                width="2"
                color="primary"
                indeterminate
              />
              <span class="ml-2">{{
                !pending.justStaked || txReceipt ? 'Processing' : 'Sending'
              }}</span>
            </div>
            <!--
    ===================================================
    Pending Status (Deposited)
    ===================================================
    -->
            <div
              v-if="
                pending.status.toLowerCase() === STATUS_TYPES.DEPOSITED ||
                pending.status.toLowerCase() === STATUS_TYPES.PENDING
              "
              class="d-flex"
            >
              <v-icon size="20" color="primary">mdi-check-circle</v-icon>
              <span class="ml-2">Deposited</span>
            </div>
            <!--
    ===================================================
    Pending Status (Failed)
    ===================================================
    -->
            <div
              v-if="pending.status.toLowerCase() === STATUS_TYPES.FAILED"
              class="d-flex align-center"
            >
              <v-icon size="20" color="error">mdi-close-circle</v-icon>
              <span class="ml-2">Failed</span>
            </div>
            <!--
    ===================================================
    Etherscan/EthVM Links
    ===================================================
    -->
            <div class="d-flex mt-6">
              <a
                v-if="pending.etherscanUrl"
                rel="noopener noreferrer"
                class="font-weight-medium"
                :href="pending.etherscanUrl"
                target="_blank"
                >View on Etherscan
                <v-icon color="primary" size="14">mdi-open-in-new</v-icon></a
              >
              <a
                v-if="pending.ethVmUrl && !onGoerli"
                rel="noopener noreferrer"
                class="font-weight-medium ml-5"
                :href="pending.ethVmUrl"
                target="_blank"
                >View on EthVM
                <v-icon color="primary" size="14">mdi-open-in-new</v-icon></a
              >
            </div>
            <!--
    ===================================================
    Waiting for validator activation 
    ===================================================
    -->
            <div
              v-if="
                pending.status.toLowerCase() === STATUS_TYPES.DEPOSITED ||
                pending.status.toLowerCase() === STATUS_TYPES.PENDING
              "
              class="d-flex flex-column mt-9"
            >
              <div class="d-flex align-center">
                <v-progress-circular
                  size="18"
                  width="2"
                  color="primary"
                  indeterminate
                />
                <span class="ml-2">Waiting for validator activation</span>
              </div>
              <span
                class="mew-label font-weight-medium captionPrimary--text mt-1"
                >Estimated wait time: {{ pending.estimatedWaitTime }}
              </span>
              <a
                v-if="pending.url"
                rel="noopener noreferrer"
                class="font-weight-medium mt-5"
                :href="pending.url"
                target="_blank"
                >Eth2 Beacon Chain transactions
                <v-icon color="primary" size="14">mdi-open-in-new</v-icon></a
              >
            </div>
          </div>
        </div>
      </div>
      <!--
    ===================================================
    Active Validators
    ===================================================
    -->
      <div v-if="activeValidators.length > 0">
        <span class="mew-heading-3">Active</span>
        <div
          v-for="(active, idx) in activeValidators"
          :key="active + idx"
          class="
            border-container
            rounded-lg
            pa-5
            mt-4
            d-flex
            justify-space-between
          "
        >
          <div class="left-container d-flex">
            <img :src="iconETHNavy" height="26" alt="ethereum" />
            <div class="left-container-details ml-3">
              <div class="mew-heading-2">
                {{ active.totalBalanceETH + ' ETH' }}
              </div>
              <div class="font-weight-medium mt-1">
                {{ '$' + active.totalBalanceFiat }}
              </div>
              <div class="textPrimary--text mt-2">
                Earned
                <span class="primary--text">{{ active.earned + ' ETH' }}</span>
                · Average APR {{ active.averageApr }}
              </div>
            </div>
          </div>
          <a
            rel="noopener noreferrer"
            class="font-weight-medium"
            :href="active.url"
            target="_blank"
            >View Eth2 address
            <v-icon color="primary" size="14">mdi-open-in-new</v-icon></a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import { mapGetters, mapState } from 'vuex';
import iconETHNavy from '@/assets/images/currencies/eth-dark-navy.svg';
import BigNumber from 'bignumber.js';
import {
  formatFloatingPointValue,
  formatFiatValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import moment from 'moment';
import { STATUS_TYPES } from '@/dapps/staked-dapp/handlers/handlerStaked';

export default {
  props: {
    validators: {
      type: Array,
      default: () => []
    },
    pendingHash: {
      type: String,
      default: ''
    },
    txReceipt: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: true
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      iconETHNavy: iconETHNavy,
      timer: [],
      expanded: 0,
      STATUS_TYPES: STATUS_TYPES
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network']),
    /**
     * @returns array
     * Returns all the raw objects in all the validators
     */
    validatorsRaw() {
      const allRawValidators = [];
      this.validators.map(validator => {
        validator.raw.map(raw => {
          allRawValidators.push(raw);
        });
      });
      return allRawValidators;
    },
    /**
     * @returns array
     * Returns all the active validators with correct info
     * includes status: ACTIVE, EXITED
     */
    activeValidators() {
      return this.validatorsRaw
        .filter(raw => {
          return (
            raw.status.toLowerCase() === STATUS_TYPES.ACTIVE ||
            raw.status.toLowerCase() === STATUS_TYPES.EXITED
          );
        })
        .map(raw => {
          const totalBalanceETH = this.convertToEth1(raw.balance);
          const earning = new BigNumber(totalBalanceETH).minus(raw.amount);
          return {
            url:
              configNetworkTypes.network[this.network.type.name].url +
              '0x' +
              raw.address,
            earned: formatFloatingPointValue(earning).value,
            totalBalanceETH: formatFloatingPointValue(totalBalanceETH).value,
            totalBalanceFiat: formatFiatValue(
              new BigNumber(totalBalanceETH).times(this.fiatValue)
            ).value,
            averageApr: formatPercentageValue(
              this.getAverageApr(raw.activation_timestamp, earning, raw.amount)
            ).value
          };
        });
    },
    /**
     * @returns array
     * Returns all the pending validators with correct info
     * includes status: DEPOSITED, PENDING, FAILED, CREATED
     */
    pendingValidators() {
      return this.validatorsRaw
        .filter(raw => {
          return (
            raw.status.toLowerCase() === STATUS_TYPES.DEPOSITED ||
            raw.status.toLowerCase() === STATUS_TYPES.PENDING ||
            raw.status.toLowerCase() === STATUS_TYPES.FAILED
          );
        })
        .map(raw => {
          return {
            amount: formatFloatingPointValue(raw.amount).value,
            amountFiat: formatFiatValue(
              new BigNumber(raw.amount).times(this.fiatValue)
            ).value,
            status: raw.status,
            ethVmUrl:
              configNetworkTypes.network[this.network.type.name].ethvmAddrUrl +
              this.address,
            etherscanUrl:
              configNetworkTypes.network[this.network.type.name]
                .etherscanAddrUrl + this.address,
            url: raw.address
              ? configNetworkTypes.network[this.network.type.name].url +
                '0x' +
                raw.address
              : '',
            estimatedWaitTime:
              raw.queue && raw.queue.estimated_activation_timestamp
                ? this.getEstimatedDuration(
                    raw.queue.estimated_activation_timestamp
                  )
                : '~'
          };
        });
    },
    /**
     * @returns array
     * Returns the validator that was just staked
     * displays after step 4 of New Stake tab
     */
    justStakedValidator() {
      if (this.pendingHash) {
        return [
          {
            amount: formatFloatingPointValue(this.amount).value,
            amountFiat: formatFiatValue(
              new BigNumber(this.amount).times(this.fiatValue)
            ).value,
            justStaked: true,
            status: STATUS_TYPES.CREATED,
            ethVmUrl: this.pendingHash
              ? configNetworkTypes.network[this.network.type.name].ethvmTxUrl +
                this.pendingHash
              : null,
            etherscanUrl: this.pendingHash
              ? configNetworkTypes.network[this.network.type.name]
                  .etherscanTxUrl + this.pendingHash
              : null
          }
        ];
      }
      return [];
    },
    /**
     * @returns array
     * Returns ALL the pending validators
     * including pending validators from api and just staked validator
     */
    allPendingValidators() {
      return this.justStakedValidator.concat(this.pendingValidators);
    }
  },
  methods: {
    /**
     * @returns BigNumber
     * Converts the unit to ETH1 from ETH2
     */
    convertToEth1(balance) {
      return new BigNumber(balance).div(new BigNumber(10).pow(9));
    },
    /**
     * @returns BigNumber
     * Gets the average apr for a specific validator
     */
    getAverageApr(activationTime, earning, amountStaked) {
      const now = moment.utc();
      const activated = moment.utc(activationTime);
      const daysActive = now.diff(activated, 'days');
      const percentIncrease = new BigNumber(earning).div(amountStaked);
      const percentIncreasePerDay =
        BigNumber(percentIncrease).dividedBy(daysActive);
      const apr = percentIncreasePerDay * 365;
      return new BigNumber(apr).times(100);
    },
    /**
     * Sets the idx container to expand
     */
    expand(idx) {
      this.expanded = this.expanded !== idx ? idx : null;
    },
    /**
     * @returns boolean
     * Returns if the pending container is expanded
     */
    isExpanded(idx) {
      return this.expanded === idx;
    },
    /**
     * @returns boolean
     * Checks if its goerli
     */
    onGoerli() {
      return this.network.type.name === 'GOERLI';
    },
    /**
     * @returns string
     * Returns the exact estimated wait time till activation in days, hours, minutes
     */
    getEstimatedDuration(timestamp) {
      const now = moment();
      const activationTime = moment(timestamp);
      const days = activationTime.diff(now, 'days');
      const hours = activationTime.subtract(days, 'days').diff(now, 'hours');
      const minutes = activationTime
        .subtract(hours, 'hours')
        .diff(now, 'minutes');
      const timeLeft = '';
      if (days > 0) {
        timeLeft.push += days + ' Days ';
      }
      if (hours > 0) {
        timeLeft.push += hours + ' Hours ';
      }
      if (minutes > 0) {
        timeLeft.push += minutes + ' Minutes ';
      }
      return timeLeft.length > 0 ? timeLeft : '~';
    }
  }
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-selectBorder-base);
}
</style>
