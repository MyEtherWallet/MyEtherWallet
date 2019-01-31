<template>
  <div class="schedule-transaction-container">
    <b-container>
      <b-row align-h="start">
        <b-col cols="2"> <back-button /> </b-col>

        <b-col class="vertical-center-self horizontal-center" cols="8">
          <h3>Schedule a transaction</h3>
        </b-col>
      </b-row>
    </b-container>
    <div class="schedule-transaction-content">
      <div class="schedule-transaction-form-container">
        <standard-input
          :options="amountInputOptions()"
          @changedValue="amount = $event"
        />
        <div class="form-block">
          <standard-input
            :options="toAddressInputOptions()"
            @changedValue="toAddress = $event"
          />
          <div v-show="!isValidAddress && toAddress !== ''" class="text-danger">
            Invalid Address
          </div>

          <hr />

          <div v-show="selectedMode === supportedModes[1]">
            <standard-input
              :options="blockNumberInputOptions()"
              @changedValue="selectedBlockNumber = $event"
            />
          </div>

          <div
            v-show="selectedMode === supportedModes[0]"
            class="datetime-picker-container"
          >
            <div class="input-title">Date & Time</div>
            <datetime-picker
              v-model="datetime"
              :min-datetime="now.toISOString()"
              class="theme-mew"
              type="datetime"
            />
          </div>

          <hr />

          <b-container class="send-form advanced">
            <b-row>
              <b-col cols="3">
                <standard-input
                  :options="bountyUsdDisplayOptions()"
                  class="bounty-usd-display"
                />
              </b-col>

              <b-col cols="3">
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
                      :class="[
                        'btn-group',
                        bounty === timeBounty && 'selected'
                      ]"
                      @click="timeBounty = bounty"
                    >
                      {{ bounty }}
                    </b-button>
                  </b-button-group>
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

              <b-col cols="6" class="toggle-button-col">
                <div class="toggle-button-container float-right">
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

            <hr />

            <div v-show="advancedExpand">
              <b-row>
                <b-col class="mode-container">
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
                </b-col>

                <b-col>
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

              <b-row>
                <b-col>
                  <standard-input
                    :options="futureGasPriceInputOptions()"
                    @changedValue="futureGasPrice = $event"
                  />
                  <div v-show="!isValidFutureGasPrice" class="text-danger">
                    Please set a gas price of {{ minGasPrice }} or higher
                  </div>
                </b-col>
                <b-col>
                  <standard-input
                    :options="gasLimitInputOptions()"
                    @changedValue="gasLimit = $event"
                  />
                  <div v-show="!isValidGasLimit" class="text-danger">
                    Please set a gas limit of 0 or higher
                  </div>
                </b-col>
                <b-col>
                  <standard-input :options="futureGasLimitInputOptions()" />
                </b-col>
              </b-row>

              <standard-input
                :options="dataInputOptions()"
                @changedValue="data = $event"
              />
            </div>
          </b-container>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
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
import { EAC } from '@ethereum-alarm-clock/lib';
import BigNumber from 'bignumber.js';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import CurrencyPicker from '../../layouts/InterfaceLayout/components/CurrencyPicker';
import StandardInput from '@/components/StandardInput';
import { isAddress } from '@/helpers/addressUtils';

const TIME_BOUNTY_PRESETS = ['0.02', '0.04', '0.08'];
const SUPPORTED_MODES = [
  {
    name: 'Date & Time',
    executionWindow: {
      min: 5,
      default: 10
    },
    unit: 'Minutes'
  },
  {
    name: 'Block Number',
    executionWindow: {
      min: 20,
      default: 90
    },
    unit: 'Blocks'
  }
];

export default {
  name: 'ScheduleTransaction',
  components: {
    'back-button': BackButton,
    'currency-picker': CurrencyPicker,
    'standard-input': StandardInput,
    'datetime-picker': Datetime
  },
  data() {
    return {
      advancedExpand: false,
      advancedTimeBounty: false,
      toAddress: '',
      amount: '0',
      gasLimit: '21000',
      minGasLimit: 0,
      futureGasPrice: '1',
      minGasPrice: 1,
      data: '',
      datetime: '',
      currentBlockNumber: '',
      selectedBlockNumber: '',
      timeBountyPresets: TIME_BOUNTY_PRESETS,
      timeBounty: TIME_BOUNTY_PRESETS[0],
      timeBountyUsd: '0',
      windowSize: 10,
      supportedModes: SUPPORTED_MODES,
      selectedMode: SUPPORTED_MODES[0],
      deposit: TIME_BOUNTY_PRESETS[0] * 2,
      amountInputOptions() {
        return {
          title: 'Amount',
          value: this.amount,
          type: 'number'
        };
      },
      toAddressInputOptions() {
        return {
          title: 'To Address',
          buttonCopy: true,
          value: this.toAddress,
          placeHolder: 'e.g. 0xa554Bb3d545C6F08909D5DD15cFe2d3c7513F597'
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
          value: `$${this.timeBountyUsd}`,
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
          value: this.gasLimit,
          inputDisabled: true,
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
    ...mapGetters(['web3', 'network', 'wallet', 'gasPrice']),
    now() {
      return new Date();
    },
    minBounty() {
      const wei = this.web3.utils.toWei(this.futureGasPrice, 'gwei');
      return this.web3.utils.fromWei(wei, 'ether');
    },
    validInputs() {
      return (
        this.isValidAddress &&
        this.isValidExecutionWindow &&
        this.isValidFutureGasPrice &&
        this.isValidGasLimit &&
        this.isValidBounty
      );
    },
    isValidAddress() {
      return (
        this.toAddress !== '' &&
        this.toAddress.length !== 0 &&
        isAddress(this.toAddress)
      );
    },
    isValidTimeBounty() {
      return new BigNumber(this.web3.utils.toWei(this.timeBounty, 'ether')).gte(
        this.web3.utils.toWei(this.futureGasPrice, 'gwei')
      );
    },
    isValidExecutionWindow() {
      return this.windowSize >= this.selectedMode.executionWindow.min;
    },
    isValidFutureGasPrice() {
      return parseFloat(this.futureGasPrice) >= this.minGasPrice;
    },
    isValidGasLimit() {
      return new BigNumber(this.gasLimit).gte(this.minGasLimit);
    }
  },
  watch: {
    selectedMode() {
      this.windowSize = this.selectedMode.executionWindow.default;
    }
  },
  beforeMount() {
    this.web3.eth
      .getBlockNumber()
      .then(res => {
        this.currentBlockNumber = res;
        this.selectedBlockNumber = res + 100;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    this.datetime = new Date(this.now.getTime() + 60 * 60 * 1000).toISOString(); // Now +1 h
    this.futureGasPrice = this.gasPrice.toString();
  },
  methods: {
    scheduleTx: async function() {
      const {
        toAddress,
        amount,
        gasLimit,
        futureGasPrice,
        data,
        selectedBlockNumber,
        deposit,
        windowSize,
        timeBounty,
        selectedMode,
        datetime
      } = this;

      const eac = new EAC(this.web3);

      const timestampScheduling = selectedMode === SUPPORTED_MODES[0];
      const timestamp = Math.round(new Date(datetime).getTime() / 1000);

      const ethToWeiBN = value => {
        value = value === '' ? 0 : value;
        return new BigNumber(this.web3.utils.toWei(value.toString(), 'ether'));
      };

      const schedulingOptions = {
        toAddress,
        windowStart: new BigNumber(
          timestampScheduling ? timestamp : selectedBlockNumber
        ),
        timestampScheduling,
        callGas: new BigNumber(gasLimit),
        callData: data,
        callValue: ethToWeiBN(amount),
        windowSize: new BigNumber(windowSize),
        bounty: ethToWeiBN(timeBounty),
        requiredDeposit: ethToWeiBN(deposit),
        gasPrice: new BigNumber(
          this.web3.utils.toWei(futureGasPrice.toString(), 'gwei')
        ),
        fee: new BigNumber(0)
      };
      console.log(schedulingOptions);

      const endowment = await eac.computeEndowment(schedulingOptions);
      const receipt = await eac.validateScheduleOptions(
        schedulingOptions,
        endowment
      );

      console.log(receipt);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ScheduleTransaction.scss';
</style>

<style lang="scss">
@import 'DateTimePicker.scss';
</style>
