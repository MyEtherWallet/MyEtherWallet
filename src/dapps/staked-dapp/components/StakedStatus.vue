<template>
  <!--
    ===================================================
    Staked Status Tab
    ===================================================
    -->
  <div class="staked-status-container mx-auto">
    <withdrawal-popup
      :reset="closeWithdrawal"
      :open-withdrawal-modal="openWithdrawalModal"
      :selected-validator="selectedValidator"
    />
    <exit-popup
      :close-modal="closeExit"
      :open-exit-modal="openExitModal"
      :selected-validator="selectedValidator"
    />
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
      <div
        v-if="
          (validators.length === 0 && justStakedValidator.length === 0) ||
          (allPendingValidators.length === 0 &&
            activeValidators.length === 0 &&
            exitedValidators.length === 0)
        "
      >
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
          class="mt-4 d-flex flex-column align-center cursor-pointer justify-space-between"
        >
          <!--
          ===================================================
          Pending Validators (Header)
          ===================================================
          -->
          <div
            :class="[
              'rounded-t-lg header-container greyLight pa-5 full-width d-flex flex-row align-center justify-space-between',
              isExpanded(idx) ? 'rounded-t-lg' : 'rounded-lg'
            ]"
            @click="expand(idx)"
          >
            <div class="left-container d-flex">
              <img :src="iconETHNavy" height="22" alt="ethereum" />
              <div class="ml-3">
                <div class="mew-heading-3">
                  {{ pending.amount }} <span class="mew-caption">ETH</span>
                </div>
                <div class="textMedium--text mt-1">
                  {{ pending.amountFiat }}
                </div>
              </div>
            </div>
            <div>
              <v-progress-circular
                size="18"
                width="2"
                color="greenPrimary"
                indeterminate
              />
              <v-icon class="ml-5" color="greyPrimary" size="22">{{
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
                color="greenPrimary"
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
              <v-icon size="20" color="greenPrimary">mdi-check-circle</v-icon>
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
              <v-icon size="20" color="redPrimary">mdi-close-circle</v-icon>
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
                <v-icon color="greenPrimary" size="14"
                  >mdi-open-in-new</v-icon
                ></a
              >
              <a
                v-if="pending.ethVmUrl"
                rel="noopener noreferrer"
                class="font-weight-medium ml-5"
                :href="pending.ethVmUrl"
                target="_blank"
                >View on EthVM
                <v-icon color="greenPrimary" size="14"
                  >mdi-open-in-new</v-icon
                ></a
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
                  color="greenPrimary"
                  indeterminate
                />
                <span class="ml-2">Waiting for validator activation</span>
              </div>
              <span class="mew-label font-weight-medium textLight--text mt-1"
                >Estimated wait time: {{ pending.estimatedWaitTime }}
              </span>
              <a
                v-if="pending.url"
                rel="noopener noreferrer"
                class="font-weight-medium mt-5"
                :href="pending.url"
                target="_blank"
                >Eth2 Beacon Chain transactions
                <v-icon color="greenPrimary" size="14"
                  >mdi-open-in-new</v-icon
                ></a
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
          class="border-container rounded-lg pa-5 mt-4 d-flex justify-space-between"
        >
          <div class="left-container d-flex">
            <img :src="iconETHNavy" height="26" alt="ethereum" />
            <div class="left-container-details ml-3">
              <div class="mew-heading-2">
                {{ active.totalBalanceETH + ' ETH' }}
              </div>
              <div class="font-weight-medium mt-1">
                {{ active.totalBalanceFiat }}
              </div>
              <div class="textLight--text mt-2">
                Earned
                <span class="greenPrimary--text">{{
                  convertTotalReward(
                    active.detailed_balance_info.total_reward_and_fees,
                    active.detailed_balance_info.conversion_factor_power
                  ) + ' ETH'
                }}</span>
                <br />
                Average APR {{ active.averageApr }}
              </div>
              <div class="mt-1 d-flex">
                <mew-button
                  class="mr-1"
                  :title="
                    !active.withdrawal_set
                      ? 'Set withdrawal address'
                      : 'Already set'
                  "
                  :disabled="active.withdrawal_set"
                  btn-size="medium"
                  @click.native="
                    () => {
                      openWithdrawal(active);
                    }
                  "
                />
                <mew-button
                  title="
                    Exit stake
                  "
                  :disabled="!active.can_exit"
                  btn-size="medium"
                  @click.native="
                    () => {
                      openExit(active);
                    }
                  "
                />
              </div>
            </div>
          </div>
          <div>
            <a
              rel="noopener noreferrer"
              class="font-weight-medium"
              :href="active.url"
              target="_blank"
              >View validator
              <v-icon color="greenPrimary" size="14">mdi-open-in-new</v-icon></a
            >
          </div>
        </div>
      </div>
      <!--
    ===================================================
    Exited Validators
    ===================================================
    -->
      <div v-if="exitedValidators.length > 0">
        <span class="mew-heading-3">Exited</span>
        <div
          v-for="(active, idx) in exitedValidators"
          :key="active + idx"
          class="border-container rounded-lg pa-5 mt-4 d-flex justify-space-between"
        >
          <div class="left-container d-flex">
            <img :src="iconETHNavy" height="26" alt="ethereum" />
            <div class="left-container-details ml-3">
              <div class="mew-heading-2">
                Validator #{{ active.validator_index }}
              </div>
              <div class="font-weight-medium mt-1">
                {{
                  active.status.toLowerCase() === STATUS_TYPES.ACTIVE ||
                  active.status.toLowerCase() === STATUS_TYPES.EXITING
                    ? 'Exited, in queue for withdrawal'
                    : 'Exited and withdrawn'
                }}
              </div>
              <div class="textLight--text mt-2">
                Earned
                <span class="greenPrimary--text"> -- ETH </span>
                <br />
                Average APR ---
              </div>
              <div class="mt-1 d-flex">
                <mew-button
                  class="mr-1"
                  :title="
                    !active.withdrawal_set
                      ? 'Set withdrawal address'
                      : 'Already set'
                  "
                  :disabled="active.withdrawal_set"
                  btn-size="medium"
                  @click.native="
                    () => {
                      openWithdrawal(active);
                    }
                  "
                />
                <mew-button
                  title="
                    Exit stake
                  "
                  :disabled="true"
                  btn-size="medium"
                  @click.native="
                    () => {
                      openExit(active);
                    }
                  "
                />
              </div>
            </div>
          </div>
          <div>
            <a
              rel="noopener noreferrer"
              class="font-weight-medium"
              :href="active.url"
              target="_blank"
              >View validator
              <v-icon color="greenPrimary" size="14">mdi-open-in-new</v-icon></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import {
  formatFloatingPointValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import { STATUS_TYPES } from '@/dapps/staked-dapp/handlers/handlerStaked';

import iconETHNavy from '@/assets/images/currencies/eth-dark-navy.svg';

export default {
  components: {
    WithdrawalPopup: () => import('./WithdrawalPopup'),
    ExitPopup: () => import('./ExitPopup')
  },
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
    },
    refetchValidators: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      iconETHNavy: iconETHNavy,
      expanded: 0,
      STATUS_TYPES: STATUS_TYPES,
      openWithdrawalModal: false,
      openExitModal: false,
      selectedValidator: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('global', ['preferredCurrency']),
    ...mapState('external', ['currencyRate']),
    ...mapState('stakedStore', ['validatorIndex', 'withdrawalValidatorIndex']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'getFiatValue']),
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
     * includes status: ACTIVE
     */
    activeValidators() {
      return this.validatorsRaw.reduce((acc, raw) => {
        if (raw.status.toLowerCase() === STATUS_TYPES.ACTIVE) {
          const totalBalanceETH = this.convertToEth1(
            raw.detailed_balance_info.balance,
            raw.detailed_balance_info.conversion_factor_power
          );
          const earning = new BigNumber(totalBalanceETH).minus(raw.amount);
          const withdrawn = this.findWithdrawalValidator(
            raw.validator_index,
            false
          );
          if (!withdrawn) {
            acc.push(
              Object.assign({}, raw, {
                url: `${
                  configNetworkTypes.network[this.network.type.name].url
                }${raw.validator_index}`,
                earned: formatFloatingPointValue(earning).value,
                totalBalanceETH:
                  formatFloatingPointValue(totalBalanceETH).value,
                totalBalanceFiat: this.getFiatValue(
                  new BigNumber(totalBalanceETH).times(this.fiatValue)
                ),
                averageApr: formatPercentageValue(
                  this.getAverageApr(raw.created, earning, raw.amount)
                ).value,
                withdrawal_set:
                  this.findValidatorIndex(raw.validator_index) ||
                  raw.withdrawal_credentials_are_eth1Address,
                can_exit: this.findWithdrawalValidator(
                  raw.validator_index,
                  raw.can_exit
                )
              })
            );
          }
        }
        return acc;
      }, []);
    },
    /**
     * @returns array
     * Returns all the active validators with correct info
     * includes status: ACTIVE, EXITED
     * currently includes active but is possibly exited
     */
    exitedValidators() {
      return this.validatorsRaw.reduce((acc, raw) => {
        if (
          raw.status.toLowerCase() === STATUS_TYPES.ACTIVE ||
          raw.status.toLowerCase() === STATUS_TYPES.EXITED ||
          raw.status.toLowerCase() === STATUS_TYPES.EXITING
        ) {
          const totalBalanceETH = this.convertToEth1(
            raw.detailed_balance_info.balance,
            raw.detailed_balance_info.conversion_factor_power
          );
          const earning = new BigNumber(totalBalanceETH).minus(raw.amount);
          const withdrawn = this.findWithdrawalValidator(
            raw.validator_index,
            true
          );
          if (
            !withdrawn ||
            raw.status.toLowerCase() === STATUS_TYPES.EXITED ||
            raw.status.toLowerCase() === STATUS_TYPES.EXITING
          ) {
            acc.push(
              Object.assign({}, raw, {
                url: `${
                  configNetworkTypes.network[this.network.type.name].url
                }${raw.validator_index}`,
                earned: formatFloatingPointValue(earning).value,
                totalBalanceETH:
                  formatFloatingPointValue(totalBalanceETH).value,
                totalBalanceFiat: this.getFiatValue(
                  new BigNumber(totalBalanceETH).times(this.fiatValue)
                ),
                averageApr: formatPercentageValue(
                  this.getAverageApr(raw.created, earning, raw.amount)
                ).value,
                withdrawal_set: true,
                can_exit: false
              })
            );
          }
        }
        return acc;
      }, []);
    },
    /**
     * @returns array
     * Returns all the pending validators with correct info
     * includes status: DEPOSITED, PENDING, FAILED, CREATED
     */
    pendingValidators() {
      return this.validatorsRaw.reduce((acc, raw) => {
        const nextDay = 60 * 60 * 24 * 1000;
        const createdDate = new Date(raw.created).getTime() + nextDay;
        const withinTheDay = new Date().getTime() <= createdDate;
        if (
          raw.status.toLowerCase() === STATUS_TYPES.DEPOSITED ||
          raw.status.toLowerCase() === STATUS_TYPES.PENDING ||
          raw.status.toLowerCase() === STATUS_TYPES.FAILED ||
          (raw.status.toLowerCase() === STATUS_TYPES.CREATED && withinTheDay)
        ) {
          acc.push({
            amount: formatFloatingPointValue(raw.amount).value,
            amountFiat: this.getFiatValue(
              new BigNumber(raw.amount).times(this.fiatValue)
            ),
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
          });
        }
        return acc;
      }, []);
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
            amountFiat: this.getFiatValue(
              new BigNumber(this.amount).times(this.fiatValue)
            ),
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
    findValidatorIndex(idx) {
      const findIdx = !!this.validatorIndex.find(item => idx === item);
      return !!findIdx;
    },
    /**
     *
     * @param {*} idx
     * @param {*} canExit
     * @returns Boolean
     *
     * checks withdrawal validator address in the local store
     */
    findWithdrawalValidator(idx, canExit) {
      const findIdx = !!this.withdrawalValidatorIndex.find(
        item => idx === item
      );
      if (findIdx) {
        return !findIdx;
      }
      return canExit;
    },
    convertTotalReward(balance, decimal) {
      const convertedBalance = BigNumber(balance)
        .div(BigNumber(10).pow(decimal))
        .toString();
      const hasEarnings = BigNumber(convertedBalance).gt(0)
        ? convertedBalance
        : BigNumber(0).toString();
      if (hasEarnings.length > 10) {
        return `${hasEarnings.slice(0, 9)}...`;
      }
      return hasEarnings;
    },
    reset() {
      this.selectedValidator = {};
      this.refetchValidators();
    },
    closeWithdrawal() {
      this.openWithdrawalModal = false;
      this.reset();
    },
    closeExit() {
      this.openExitModal = false;
      this.reset();
    },
    /**
     * Open modal and set selected validator
     */
    openWithdrawal(validator) {
      this.selectedValidator = validator;
      this.openWithdrawalModal = true;
    },
    /**
     * Open modal and set selected validator
     */
    openExit(validator) {
      this.selectedValidator = validator;
      this.openExitModal = true;
    },
    /**
     * @returns BigNumber
     * Converts the unit to ETH1 from ETH2
     */
    convertToEth1(balance, decimal = 9) {
      return new BigNumber(balance).div(new BigNumber(10).pow(decimal));
    },
    /**
     * @returns BigNumber
     * Gets the average apr for a specific validator
     */
    getAverageApr(activationTime, earning, amountStaked) {
      if (earning.lte(0)) {
        return BigNumber(0);
      }
      const now = moment.utc();
      const activated = moment.utc(activationTime);
      const daysActive = now.diff(activated, 'days');
      const percentIncrease = BigNumber(earning).div(amountStaked);
      const percentIncreasePerDay =
        BigNumber(percentIncrease).dividedBy(daysActive);
      const apr = percentIncreasePerDay.times(365).times(100);
      return new BigNumber(apr);
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
     * @returns string
     * Returns the exact estimated wait time till activation in days, hours, minutes
     */
    getEstimatedDuration(timestamp) {
      const now = moment().utc();
      const activationTime = moment(timestamp);
      if (now.unix() === activationTime.unix())
        return 'Should activate momentarily';
      return `${activationTime.diff(now, 'days')} days ${activationTime.diff(
        now,
        'hours'
      )} hours and ${activationTime.diff(now, 'minutes')} minutes`;
    }
  }
};
</script>

<style lang="scss" scoped>
.staked-status-container {
  max-width: 500px;
}
.border-container {
  border: 1px solid var(--v-greyLight-base);
}
</style>
