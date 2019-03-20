<template>
  <div class="schedule-view-container">
    <h3 class="page-title">Schedule a transaction</h3>

    <div class="schedule-view-content">
      <div class="schedule-view-form-container">
        <b-container>
          <b-row>
            <b-col cols="12" md="4">
              <div class="scheduling-currency-picker">
                <div class="input-title">{{ $t('interface.sendTxType') }}</div>
                <currency-picker
                  :currency="tokensWithBalance"
                  :page="'sendEgasAmountthAndTokens'"
                  :token="true"
                  @selectedCurrency="selectedCurrency = $event"
                />
              </div>
            </b-col>
            <b-col cols="12" md="8">
              <standard-input
                :options="amountInputOptions()"
                @changedValue="amount = $event"
              />
              <div v-show="!isValidAmount" class="text-danger">
                Amount higher than balance
              </div>
              <div v-show="!hasEnoughEthToSchedule" class="text-danger">
                Not enough ETH on account to schedule
              </div>
            </b-col>
          </b-row>

          <div class="to-address">
            <div class="title input-title">
              <h4>
                To Address
                <blockie
                  v-show="isValidAddress"
                  :address="hexAddress"
                  :size="8"
                  :scale="16"
                  width="32px"
                  height="32px"
                  class="blockie-image"
                />
              </h4>

              <p
                class="copy-button prevent-user-select"
                @click="copyToClipboard('address')"
              >
                {{ $t('common.copy') }}
              </p>
            </div>
            <div class="the-form address-block">
              <input
                v-ens-resolver="'address'"
                ref="address"
                v-model="address"
                type="text"
                name="name"
                autocomplete="off"
              />
              <i
                :class="[
                  isValidAddress && hexAddress.length !== 0 ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>

          <hr />

          <div v-show="selectedMode === supportedModes[1]">
            <standard-input
              :options="blockNumberInputOptions()"
              @changedValue="selectedBlockNumber = $event"
            />
            <div v-show="!isValidBlockNumber" class="text-danger">
              Should be at least
              {{ supportedModes[1].executionWindow.min }} blocks in the future
            </div>
          </div>

          <b-row v-show="selectedMode === supportedModes[0]">
            <b-col cols="12" md="6">
              <div class="datetime-picker-container">
                <div class="input-title">Date & Time</div>
                <datetime-picker
                  v-model="datetime"
                  :min-datetime="now.toISOString()"
                  :value-zone="selectedTimeZone"
                  :zone="selectedTimeZone"
                  class="theme-mew"
                  type="datetime"
                />
                <div v-show="!isValidDateTime" class="text-danger">
                  Make sure that the time is at least
                  {{ supportedModes[0].executionWindow.min }} minutes in the
                  future
                </div>
              </div>
            </b-col>

            <b-col cols="12" md="6">
              <div class="timezone-selector">
                <div class="input-title">Timezone</div>
                <standard-dropdown
                  :options="timezoneOptions"
                  :placeholder="selectedTimeZone"
                  @selection="selectedTimeZone = $event"
                />
              </div>
            </b-col>
          </b-row>

          <hr />

          <b-row>
            <b-col cols="12" sm="6" md="6">
              <div v-show="!advancedExpand" class="time-bounty-selector">
                <div
                  v-b-tooltip.hover
                  title="The amount of ETH you wish to offer to TimeNodes in exchange for execution. The higher the Time Bounty, the likelier your transaction will get executed."
                  class="input-title"
                >
                  Time Bounty
                </div>
                <b-button-group>
                  <b-button
                    v-for="(bounty, index) in timeBountyPresets"
                    :key="index"
                    :class="['btn-group', bounty === timeBounty && 'selected']"
                    @click="timeBounty = bounty"
                  >
                    {{ bounty }}
                  </b-button>
                </b-button-group>
                <div class="timebounty-gasprice-coverage">
                  Covers up to
                  <span>{{ estimatedMaximumExecutionGasPrice }}</span> gwei gas
                  price on future execution
                </div>
              </div>

              <div v-show="advancedExpand">
                <standard-input
                  :options="customTimeBountyInputOptions()"
                  @changedValue="timeBounty = $event"
                />
                <div v-show="!isValidTimeBounty" class="text-danger">
                  Please set a bounty of {{ minBounty }} or higher
                </div>
              </div>
            </b-col>

            <b-col cols="12" sm="6" md="3">
              <standard-input
                :options="bountyUsdDisplayOptions()"
                class="bounty-usd-display"
              />
            </b-col>

            <b-col cols="12" sm="12" md="3" class="toggle-button-col">
              <hr class="d-block d-md-none" />
              <div class="toggle-button-container float-md-right">
                <h4>Advanced</h4>
                <div class="toggle-button">
                  <!-- Rounded switch -->
                  <div class="sliding-switch-white">
                    <label class="switch">
                      <input
                        type="checkbox"
                        @click="advancedExpand = !advancedExpand"
                      />
                      <span class="slider round" />
                    </label>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>

          <div v-show="advancedExpand">
            <b-row>
              <b-col cols="12" md="6">
                <div class="mode-container">
                  <div class="input-title">Scheduling mode</div>
                  <b-button-group>
                    <b-button
                      v-for="(mode, index) in supportedModes"
                      :key="index"
                      :class="['mode-btn', mode === selectedMode && 'selected']"
                      @click="selectedMode = mode"
                    >
                      {{ mode.name }}
                    </b-button>
                  </b-button-group>
                </div>
              </b-col>

              <b-col cols="12" md="6">
                <standard-input
                  :options="executionWindowInputOptions()"
                  @changedValue="windowSize = $event"
                />
                <div v-show="!isValidExecutionWindow" class="text-danger">
                  Please set an execution window of
                  {{ selectedMode.executionWindow.min }} or higher
                </div>
              </b-col>
            </b-row>

            <standard-input
              :options="requireDepositInputOptions()"
              @changedValue="deposit = $event"
            />
            <div v-show="!isValidDeposit" class="text-danger">
              Invalid deposit number
            </div>

            <b-row>
              <b-col cols="12" md="4">
                <standard-input
                  :options="futureGasPriceInputOptions()"
                  @changedValue="futureGasPrice = $event"
                />
                <div v-show="!isValidFutureGasPrice" class="text-danger">
                  Please set a gas price of {{ minGasPrice }} or higher
                </div>
              </b-col>
              <b-col cols="12" md="4">
                <standard-input
                  :options="gasLimitInputOptions()"
                  @changedValue="gasLimit = $event"
                />
                <div v-show="!isValidGasLimit" class="text-danger">
                  Please set a gas limit of 0 or higher
                </div>
              </b-col>
              <b-col cols="12" md="4">
                <standard-input
                  :options="futureGasLimitInputOptions()"
                  @changedValue="futureGasLimit = $event"
                />
                <div v-show="!isValidFutureGasLimit" class="text-danger">
                  Please set a future gas limit of 0 or higher
                </div>
              </b-col>
            </b-row>

            <standard-input
              v-if="!isTokenTransfer"
              :options="dataInputOptions()"
              @changedValue="data = $event"
            />
            <div v-show="!isValidData" class="text-danger">
              Please provide the data in a hexadecimal format.
            </div>
          </div>
        </b-container>
      </div>

      <div class="submit-button-container">
        <b-alert
          :show="isTokenTransfer && showTokenTransferNotification"
          variant="info"
          dismissible
          class="mx-5"
          @dismissed="showTokenTransferNotification = false"
        >
          <strong>Note:</strong> You are scheduling a token transfer. Token
          transfers require 2 separate transactions. One for token scheduling
          and another one for token transfer approval.
        </b-alert>

        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="scheduleTx"
        >
          Schedule Transaction
        </div>
      </div>
    </div>
    <a
      href="https://blog.chronologic.network/announcing-the-ethereum-alarm-clock-chronologic-partnership-b3d7545bea3b"
      target="_blank"
      rel="noopener noreferrer"
      class="eac-logo"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EAC, Util } from '@ethereum-alarm-clock/lib';
import BigNumber from 'bignumber.js';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import moment from 'moment';
import 'moment-timezone';
import * as unit from 'ethjs-unit';
import { Toast } from '@/helpers';

import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import CurrencyPicker from '../../../layouts/InterfaceLayout/components/CurrencyPicker';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from '@/components/StandardDropdown';
import Blockie from '@/components/Blockie';
import { ERC20 } from '@/partners';
import {
  calcSchedulingTotalCost,
  canBeConvertedToWei,
  EAC_SCHEDULING_CONFIG,
  estimateBountyForGasPrice
} from '../ScheduleHelpers';

export default {
  name: 'ScheduleView',
  components: {
    'back-button': BackButton,
    'currency-picker': CurrencyPicker,
    'standard-input': StandardInput,
    'standard-dropdown': StandardDropdown,
    'datetime-picker': Datetime,
    blockie: Blockie
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      eac: null,
      advancedExpand: false,
      advancedTimeBounty: false,
      hexAddress: '',
      address: '',
      isValidAddress: false,
      amount: '0',
      gasLimit: EAC_SCHEDULING_CONFIG.FUTURE_GAS_LIMIT,
      futureGasLimit: EAC_SCHEDULING_CONFIG.FUTURE_GAS_LIMIT,
      minGasLimit: 0,
      futureGasPrice: '1',
      minGasPrice: 0.1,
      data: '',
      datetime: '',
      currentBlockNumber: '',
      selectedBlockNumber: '',
      timeBountyPresets: EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULTS,
      timeBounty: EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULTS[0],
      windowSize: 10,
      supportedModes: EAC_SCHEDULING_CONFIG.SUPPORTED_MODES,
      selectedMode: EAC_SCHEDULING_CONFIG.SUPPORTED_MODES[0],
      deposit:
        EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULTS[0] *
        EAC_SCHEDULING_CONFIG.BOUNTY_TO_DEPOSIT_MULTIPLIER,
      ethPrice: new BigNumber(0),
      selectedTimeZone: moment.tz.guess(),
      selectedCurrency: '',
      showTokenTransferNotification: true,
      amountInputOptions() {
        return {
          title: 'Amount',
          value: this.amount,
          type: 'number'
        };
      },
      customTimeBountyInputOptions() {
        return {
          title: 'Time Bounty',
          placeHolder: 'ETH',
          value: this.timeBounty,
          type: 'number'
        };
      },
      bountyUsdDisplayOptions() {
        return {
          value: this.timeBountyUsd,
          inputDisabled: true
        };
      },
      blockNumberInputOptions() {
        return {
          title: 'Block Number',
          value: this.selectedBlockNumber,
          placeHolder: `Current block number: ${this.currentBlockNumber}`,
          type: 'number'
        };
      },
      dataInputOptions() {
        return {
          title: 'Add Data',
          placeHolder: 'Add Data (e.g. 0x7834f874g298hf298h234f)',
          value: this.data
        };
      },
      gasLimitInputOptions() {
        return {
          title: 'Gas Limit',
          value: this.gasLimit,
          type: 'number'
        };
      },
      futureGasPriceInputOptions() {
        return {
          title: 'Future Gas Price (gwei)',
          value: this.futureGasPrice,
          type: 'number'
        };
      },
      futureGasLimitInputOptions() {
        return {
          title: 'Future Gas Limit',
          value: this.futureGasLimit,
          type: 'number'
        };
      },
      requireDepositInputOptions() {
        return {
          title: 'Require a deposit',
          value: this.deposit,
          placeHolder: 'ETH',
          type: 'number'
        };
      },
      executionWindowInputOptions() {
        return {
          title: 'Execution Window',
          value: this.windowSize,
          placeHolder: this.selectedMode.unit,
          type: 'number'
        };
      }
    };
  },
  computed: {
    ...mapGetters(['web3', 'network', 'gasPrice', 'notifications', 'account']),
    isTokenTransfer() {
      return this.selectedCurrency.symbol !== this.network.type.name;
    },
    timeBountyUsd() {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      });

      return formatter.format(
        this.ethPrice.times(new BigNumber(this.timeBounty))
      );
    },
    estimatedMaximumExecutionGasPrice() {
      if (
        !this.isValidFutureGasPrice ||
        !this.isValidFutureGasLimit ||
        !this.isValidTimeBounty
      )
        return 0;

      const estimated = Util.estimateMaximumExecutionGasPrice(
        new BigNumber(unit.toWei(this.timeBounty, 'ether')),
        new BigNumber(unit.toWei(this.futureGasPrice, 'gwei')),
        new BigNumber(this.futureGasLimit)
      );

      return Math.round(unit.fromWei(estimated.toString(), 'gwei'));
    },
    now() {
      return moment();
    },
    minBounty() {
      if (!this.isValidFutureGasPrice) return 0;
      const wei = unit.toWei(this.futureGasPrice, 'gwei');
      return unit.fromWei(wei, 'ether');
    },
    timezoneOptions() {
      return moment.tz.names();
    },
    schedulingCost() {
      if (
        !this.isValidFutureGasPrice ||
        !this.isValidGasLimit ||
        !this.isValidFutureGasLimit ||
        !this.isValidTimeBounty
      ) {
        // Make the scheduling cost ridiculously big to throw an error
        return new BigNumber(1e32 * 1e18);
      }

      return calcSchedulingTotalCost({
        gasPrice: new BigNumber(unit.toWei(this.gasPrice.toString(), 'gwei')),
        gasLimit: new BigNumber(this.gasLimit),
        futureGasLimit: new BigNumber(this.futureGasLimit),
        futureGasPrice: new BigNumber(
          unit.toWei(this.futureGasPrice.toString(), 'gwei')
        ),
        timeBounty: new BigNumber(
          unit.toWei(this.timeBounty.toString(), 'ether')
        )
      });
    },
    maxEthToSend() {
      const accountBalance = new BigNumber(this.account.balance);
      const sendableEth = accountBalance.minus(this.schedulingCost);
      return sendableEth.gt(0) ? sendableEth : new BigNumber(0);
    },
    validInputs() {
      return (
        this.hasEnoughEthToSchedule &&
        this.isValidAmount &&
        this.isValidAddress &&
        this.isValidExecutionWindow &&
        this.isValidFutureGasPrice &&
        this.isValidFutureGasLimit &&
        this.isValidGasLimit &&
        this.isValidTimeBounty &&
        this.isValidWindowStart &&
        this.isValidData
      );
    },
    isValidAmount() {
      if (!canBeConvertedToWei(this.web3, this.amount.toString())) return false;

      const enteredAmount = new BigNumber(
        this.isTokenTransfer
          ? this.amount
          : unit.toWei(this.amount.toString(), 'ether')
      );
      const max = new BigNumber(
        this.isTokenTransfer
          ? this.selectedCurrency.balance
          : this.maxEthToSend.toString()
      );

      return enteredAmount.lte(max);
    },
    isValidDateTime() {
      return (
        moment(this.datetime) >
        moment().add(this.supportedModes[0].executionWindow.min, 'minutes')
      );
    },
    isValidBlockNumber() {
      const { selectedBlockNumber, supportedModes, currentBlockNumber } = this;
      return (
        parseInt(selectedBlockNumber) >
        currentBlockNumber + supportedModes[1].executionWindow.min
      );
    },
    isValidWindowStart() {
      const {
        selectedMode,
        supportedModes,
        isValidBlockNumber,
        isValidDateTime
      } = this;
      return selectedMode === supportedModes[0]
        ? isValidDateTime
        : isValidBlockNumber;
    },
    isValidTimeBounty() {
      const convertibleToWei = canBeConvertedToWei(this.web3, this.timeBounty);
      const invalidFutureGasPrice = canBeConvertedToWei(
        this.web3,
        this.futureGasPrice,
        'gwei'
      );
      if (!invalidFutureGasPrice || !convertibleToWei) return false;

      const higherThanGasPrice = new BigNumber(
        unit.toWei(this.timeBounty, 'ether')
      ).gte(unit.toWei(this.futureGasPrice, 'gwei'));
      return higherThanGasPrice;
    },
    isValidExecutionWindow() {
      return this.windowSize >= this.selectedMode.executionWindow.min;
    },
    isValidFutureGasPrice() {
      const isHigherThanMin =
        parseFloat(this.futureGasPrice) >= this.minGasPrice;
      const convertibleToWei = canBeConvertedToWei(
        this.web3,
        this.futureGasPrice,
        'gwei'
      );
      return isHigherThanMin && convertibleToWei;
    },
    isValidGasLimit() {
      return new BigNumber(this.gasLimit).gte(this.minGasLimit);
    },
    isValidFutureGasLimit() {
      return new BigNumber(this.futureGasLimit).gte(this.minGasLimit);
    },
    isValidDeposit() {
      return canBeConvertedToWei(this.web3, this.deposit);
    },
    isValidData() {
      return this.web3.utils.isHexStrict(this.data) || this.data === '';
    },
    hasEnoughEthToSchedule() {
      const accountBalance = new BigNumber(this.account.balance);
      return accountBalance.gt(this.schedulingCost);
    }
  },
  watch: {
    selectedMode() {
      this.windowSize = this.selectedMode.executionWindow.default;
    },
    async notifications() {
      const notifications = this.notifications[this.account.address];
      const latestNotification = notifications[0];

      if (latestNotification.hash) {
        if (latestNotification.status === 'pending') {
          const transaction = await this.web3.eth.getTransaction(
            latestNotification.hash
          );

          try {
            if (transaction === null) {
              Toast.responseHandler(
                new Error('Non-existing transaction detected'),
                Toast.ERROR
              );
              return;
            }

            const isTokenTransfer = transaction.input.includes(
              EAC_SCHEDULING_CONFIG.TOKEN_TRANSFER_METHOD_ID
            );
            this.$router.push({
              name: 'Scheduled success',
              params: {
                txHash: latestNotification.hash,
                isTokenTransfer,
                selectedCurrency: isTokenTransfer
                  ? this.selectedCurrency
                  : null,
                toAddress: transaction.to,
                amount: this.amount
              }
            });
          } catch (e) {
            Toast.responseHandler(e, Toast.ERROR);
          }
        }
      }
    },
    async selectedCurrency() {
      this.futureGasLimit = await this.estimateGas();
      this.gasLimit = this.isTokenTransfer
        ? EAC_SCHEDULING_CONFIG.TOKEN_SCHEDULING_GAS_LIMIT
        : EAC_SCHEDULING_CONFIG.FUTURE_GAS_LIMIT;
    },
    async hexAddress() {
      this.futureGasLimit = await this.estimateGas();
    }
  },
  beforeMount() {
    this.selectedCurrency = {
      name: this.network.type.name_long,
      symbol: this.network.type.name
    };

    this.web3.eth
      .getBlockNumber()
      .then(res => {
        this.currentBlockNumber = res;
        this.selectedBlockNumber = res + 100;
      })
      .catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });

    this.datetime = moment()
      .add(1, 'days')
      .toISOString();
    this.futureGasPrice = (this.gasPrice >= this.minGasPrice
      ? this.gasPrice
      : this.minGasPrice
    ).toString();

    this.timeBountyPresets = [
      estimateBountyForGasPrice(this.futureGasPrice * 5, this.futureGasLimit),
      estimateBountyForGasPrice(this.futureGasPrice * 8, this.futureGasLimit),
      estimateBountyForGasPrice(this.futureGasPrice * 13, this.futureGasLimit)
    ];

    this.timeBounty = this.timeBountyPresets[0];
    this.deposit = this.timeBountyPresets[0] * 2;
  },
  mounted: async function() {
    this.eac = new EAC(this.web3);

    const url = 'https://cryptorates.mewapi.io/convert/ETH';
    const fetchValues = await fetch(url);
    const values = await fetchValues.json();

    if (!values['USDT']) {
      Toast.responseHandler(
        new Error(
          'USDT conversion no longer available. Please provide an alternative USD conversion method'
        ),
        Toast.ERROR
      );
      return;
    }
    this.ethPrice = new BigNumber(values['USDT']);
  },
  methods: {
    async estimateGas() {
      const coinbase = await this.web3.eth.getCoinbase();

      if (this.isValidAmount && this.isValidAddress) {
        const tokenTransferData = await this.getTokenTransferData();
        const inputData = this.data === '' ? '0x00' : this.data;

        const tokenSchedulingTransaction = {
          from: coinbase,
          value: this.isTokenTransfer
            ? 0
            : unit.toWei(this.amount.toString(), 'ether'),
          to: this.isTokenTransfer
            ? this.selectedCurrency.address
            : this.hexAddress,
          data: this.isTokenTransfer ? tokenTransferData : inputData
        };

        let estimatedGasLimit;
        try {
          estimatedGasLimit = await this.web3.eth.estimateGas(
            tokenSchedulingTransaction
          );
        } catch (e) {
          Toast.responseHandler(e, Toast.ERROR);
          return EAC_SCHEDULING_CONFIG.FUTURE_GAS_LIMIT.toString();
        }

        const totalEstimatedGasLimit = new BigNumber(estimatedGasLimit).plus(
          EAC_SCHEDULING_CONFIG.TOKEN_TRANSFER_ADDITIONAL_GAS
        );
        return totalEstimatedGasLimit.toString();
      }

      return EAC_SCHEDULING_CONFIG.FUTURE_GAS_LIMIT.toString();
    },
    async getTokenTransferData() {
      if (this.isTokenTransfer && this.isValidAmount && this.isValidAddress) {
        const tokenContract = await new this.web3.eth.Contract(
          ERC20,
          this.selectedCurrency.address
        );

        const coinbase = await this.web3.eth.getCoinbase();
        const tokenAmount = new BigNumber(
          this.amount * Math.pow(10, this.selectedCurrency.decimals)
        );

        return tokenContract.methods
          .transferFrom(coinbase, this.hexAddress, tokenAmount.toString())
          .encodeABI();
      }

      return '0x00';
    },
    async scheduleTx() {
      const {
        amount,
        hexAddress,
        futureGasPrice,
        futureGasLimit,
        gasLimit,
        selectedBlockNumber,
        deposit,
        windowSize,
        timeBounty,
        selectedMode,
        datetime,
        isTokenTransfer,
        selectedCurrency
      } = this;

      let { data } = this;

      if (data === '') {
        data = '0x00';
      }

      const timestampScheduling =
        selectedMode === EAC_SCHEDULING_CONFIG.SUPPORTED_MODES[0];

      const timestamp = moment(datetime).unix();

      const ethToWeiBN = value => {
        value = value === '' ? 0 : value;
        return new BigNumber(unit.toWei(value.toString(), 'ether'));
      };

      const schedulingOptions = {
        toAddress: isTokenTransfer ? selectedCurrency.address : hexAddress,
        windowStart: new BigNumber(
          timestampScheduling ? timestamp : selectedBlockNumber
        ),
        timestampScheduling,
        callGas: new BigNumber(futureGasLimit),
        callData: isTokenTransfer ? await this.getTokenTransferData() : data,
        callValue: isTokenTransfer ? new BigNumber(0) : ethToWeiBN(amount),
        windowSize: new BigNumber(
          timestampScheduling ? windowSize * 60 : windowSize
        ),
        bounty: ethToWeiBN(timeBounty),
        requiredDeposit: ethToWeiBN(deposit),
        gasPrice: new BigNumber(unit.toWei(futureGasPrice.toString(), 'gwei')),
        fee: new BigNumber(0),
        scheduleGas: new BigNumber(gasLimit)
      };

      const endowment = await this.eac.computeEndowment(schedulingOptions);

      try {
        await this.eac.validateScheduleOptions(schedulingOptions, endowment);
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
        return;
      }

      this.eac.schedule(schedulingOptions);
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ScheduleView.scss';
</style>

<style lang="scss">
@import 'ScheduleViewUnscoped.scss';
</style>
