<template>
  <div class="schedule-view-container">
    <h3 class="page-title">{{ $t('scheduleTx.title') }}</h3>

    <div class="schedule-view-content">
      <div class="schedule-view-form-container">
        <b-container>
          <b-row>
            <b-col cols="12" md="4">
              <div class="scheduling-currency-picker">
                <div class="input-title">{{ $t('sendTx.type') }}</div>
                <currency-picker
                  :currency="tokensWithBalance"
                  :clear-currency="clearCurrency"
                  :page="'sendEgasAmountthAndTokens'"
                  :token="true"
                  @selectedCurrency="selectedCurrency = $event"
                />
              </div>
            </b-col>
            <b-col cols="12" md="8">
              <standard-input
                :clear-input="clearInput"
                :options="{
                  title: $t('sendTx.amount'),
                  value: amount,
                  type: 'number'
                }"
                @changedValue="amount = $event"
              />
              <div v-show="!isValidAmount" class="text-danger">
                {{ $t('scheduleTx.warning.amount-higher-balance') }}
              </div>
              <div v-show="!hasEnoughEthToSchedule" class="text-danger">
                {{ $t('scheduleTx.warning.not-enough-eth') }}
              </div>
            </b-col>
          </b-row>

          <div class="to-address">
            <dropdown-address-selector
              :clear-address="clearAddress"
              :title="$t('sendTx.to-addr')"
              @toAddress="getToAddress($event)"
            />
          </div>

          <hr />

          <div v-show="selectedMode === supportedModes[1]">
            <standard-input
              :clear-input="clearInput"
              :options="{
                title: $t('scheduleTx.block-num'),
                value: selectedBlockNumber,
                placeHolder: `${this.$t(
                  'scheduleTx.curr-block'
                )} ${currentBlockNumber}`,
                type: 'number'
              }"
              @changedValue="selectedBlockNumber = $event"
            />
            <div v-show="!isValidBlockNumber" class="text-danger">
              {{
                $t('scheduleTx.at-least-blocks', {
                  number: supportedModes[1].executionWindow.min
                })
              }}
            </div>
          </div>

          <b-row v-show="selectedMode === supportedModes[0]">
            <b-col cols="12" md="6">
              <div class="datetime-picker-container">
                <div class="input-title">{{ $t('scheduleTx.date-time') }}</div>
                <datetime-picker
                  v-model="datetime"
                  :min-datetime="now.toISOString()"
                  :value-zone="selectedTimeZone"
                  :zone="selectedTimeZone"
                  class="theme-mew"
                  type="datetime"
                />
                <div v-show="!isValidDateTime" class="text-danger">
                  {{
                    $t('scheduleTx.at-least-minutes', {
                      min: supportedModes[0].executionWindow.min
                    })
                  }}
                </div>
              </div>
            </b-col>

            <b-col cols="12" md="6">
              <div class="timezone-selector">
                <div class="input-title">{{ $t('scheduleTx.timezone') }}</div>
                <standard-dropdown
                  :options="timezoneOptions"
                  :placeholder="selectedTimeZone"
                  :clear-timezone="clearTimezone"
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
                  :title="$t('scheduleTx.time-bounty.desc')"
                  class="input-title"
                >
                  {{ $t('scheduleTx.time-bounty.title') }}
                </div>
                <b-button-group>
                  <b-button
                    v-for="(bounty, index) in timeBountyPresets"
                    :key="index"
                    :class="['btn-group', bounty === timeBounty && 'selected']"
                    @click="timeBounty = bounty"
                    >{{ bounty }}</b-button
                  >
                </b-button-group>
                <div class="timebounty-gasprice-coverage">
                  {{
                    $t('scheduleTx.time-bounty.caption', {
                      gas: estimatedMaximumExecutionGasPrice
                    })
                  }}
                </div>
              </div>

              <div v-show="advancedExpand">
                <standard-input
                  :options="{
                    title: $t('scheduleTx.time-bounty.title'),
                    placeHolder: 'ETH',
                    value: timeBounty,
                    type: 'number'
                  }"
                  :clear-input="clearInput"
                  @changedValue="timeBounty = $event"
                />
                <div v-show="!isValidTimeBounty" class="text-danger">
                  {{ $t('scheduleTx.warning.min-bounty', { min: minBounty }) }}
                </div>
              </div>
            </b-col>

            <b-col cols="12" sm="6" md="3">
              <standard-input
                :clear-input="clearInput"
                :options="{
                  value: timeBountyUsd,
                  inputDisabled: true
                }"
                class="bounty-usd-display"
              />
            </b-col>

            <b-col cols="12" sm="12" md="3" class="toggle-button-col">
              <hr class="d-block d-md-none" />
              <div class="toggle-button-container float-md-right">
                <h4>{{ $t('common.advanced') }}</h4>
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
                  <div class="input-title">{{ $t('scheduleTx.mode') }}</div>
                  <b-button-group>
                    <b-button
                      v-for="(mode, index) in supportedModes"
                      :key="index"
                      :class="['mode-btn', mode === selectedMode && 'selected']"
                      @click="selectedMode = mode"
                      >{{ $t(mode.name) }}</b-button
                    >
                  </b-button-group>
                </div>
              </b-col>

              <b-col cols="12" md="6">
                <standard-input
                  :clear-input="clearInput"
                  :options="{
                    title: $t('scheduleTx.exec-window'),
                    value: windowSize,
                    placeHolder: selectedMode.unit,
                    type: 'number'
                  }"
                  @changedValue="windowSize = $event"
                />
                <div v-show="!isValidExecutionWindow" class="text-danger">
                  {{
                    $t('scheduleTx.set.exec-window', {
                      min: selectedMode.executionWindow.min
                    })
                  }}
                </div>
              </b-col>
            </b-row>

            <standard-input
              :clear-input="clearInput"
              :options="{
                title: $t('scheduleTx.req-deposit'),
                value: deposit,
                placeHolder: $t('common.currency.eth'),
                type: 'number'
              }"
              @changedValue="deposit = $event"
            />
            <div v-show="!isValidDeposit" class="text-danger">
              {{ $t('scheduleTx.invalid-number') }}
            </div>

            <b-row>
              <b-col cols="12" md="4">
                <standard-input
                  :clear-input="clearInput"
                  :options="{
                    title: $t('scheduleTx.future-gas-price'),
                    value: futureGasPrice,
                    type: 'number'
                  }"
                  @changedValue="futureGasPrice = $event"
                />
                <div v-show="!isValidFutureGasPrice" class="text-danger">
                  {{ $t('scheduleTx.set.gas-price', { min: minGasPrice }) }}
                </div>
              </b-col>
              <b-col cols="12" md="4">
                <standard-input
                  :clear-input="clearInput"
                  :options="{
                    title: $t('common.gas.limit'),
                    value: gasLimit,
                    type: 'number'
                  }"
                  @changedValue="gasLimit = $event"
                />
                <div v-show="!isValidGasLimit" class="text-danger">
                  {{ $t('scheduleTx.set.gas-limit') }}
                </div>
              </b-col>
              <b-col cols="12" md="4">
                <standard-input
                  :clear-input="clearInput"
                  :options="{
                    title: $t('scheduleTx.future-gas-limit'),
                    value: futureGasLimit,
                    type: 'number'
                  }"
                  @changedValue="futureGasLimit = $event"
                />
                <div v-show="!isValidFutureGasLimit" class="text-danger">
                  {{ $t('scheduleTx.set.future-gas-limit') }}
                </div>
              </b-col>
            </b-row>

            <standard-input
              v-if="!isTokenTransfer"
              :clear-input="clearInput"
              :options="{
                title: $t('scheduleTx.add-data'),
                placeHolder: `${this.$t(
                  'scheduleTx.add-data'
                )} (e.g. 0x7834f874g298hf298h234f)`,
                value: data
              }"
              @changedValue="data = $event"
            />
            <div v-show="!isValidData" class="text-danger">
              {{ $t('scheduleTx.provide-data-in-hex') }}
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
          <strong>{{ $t('scheduleTx.note.string') }}</strong>
          {{ $t('scheduleTx.note.token-transfer') }}
        </b-alert>

        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="scheduleTx"
        >
          {{ $t('scheduleTx.string') }}
        </div>
        <div class="clear-all-btn" @click="clear()">
          {{ $t('common.clear-all') }}
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
import { mapState } from 'vuex';
import { EAC, Util } from '@ethereum-alarm-clock/lib';
import BigNumber from 'bignumber.js';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import moment from 'moment';
import 'moment-timezone';
import * as unit from 'ethjs-unit';
import { Toast } from '@/helpers';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import CurrencyPicker from '../../../layouts/InterfaceLayout/components/CurrencyPicker';
import StandardInput from '@/components/StandardInput';
import StandardDropdown from '@/components/StandardDropdown';
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
    'currency-picker': CurrencyPicker,
    'standard-input': StandardInput,
    'standard-dropdown': StandardDropdown,
    'datetime-picker': Datetime,
    'dropdown-address-selector': DropDownAddressSelector
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
      clearCurrency: false,
      clearInput: false,
      clearTimezone: false,
      clearAddress: false
    };
  },
  computed: {
    ...mapState('main', [
      'web3',
      'network',
      'gasPrice',
      'notifications',
      'account',
      'online'
    ]),
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
              const toastText = this.$t('scheduleTx.non-exist-tx');
              Toast.responseHandler(new Error(toastText), Toast.ERROR);
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
    if (this.online) {
      this.eac = new EAC(this.web3);

      const url = 'https://cryptorates.mewapi.io/convert/ETH';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();

      if (!values['USDT']) {
        const toastText = this.$t('scheduleTx.usdt-not-available');
        Toast.responseHandler(new Error(toastText), Toast.ERROR);
        return;
      }
      this.ethPrice = new BigNumber(values['USDT']);
    }
  },
  methods: {
    clear() {
      this.clearCurrency = !this.clearCurrency;
      this.clearInput = !this.clearInput;
      this.hexAddress = '';
      this.address = '';
      this.datetime = moment()
        .add(1, 'days')
        .toISOString();
      this.clearTimezone = !this.clearTimezone;
      this.clearAddress = !this.clearAddress;
      this.timeBounty = EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULTS[0];
    },
    getToAddress(data) {
      this.address = data.address;
      this.hexAddress = data.address;
      this.isValidAddress = data.valid;
    },
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
      this.clear();
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
