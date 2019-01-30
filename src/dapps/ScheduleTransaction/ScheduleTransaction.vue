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
          <div
            v-show="!isValidAddress && toAddress !== ''"
            class="text-danger">
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
                <div
                  v-show="!advancedExpand"
                  class="time-bounty-selector"
                >
                  <div class="input-title">Time Bounty</div>
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

                <div
                  v-show="advancedExpand">
                  <standard-input
                    :options="customTimeBountyInputOptions()"
                    @changedValue="timeBounty = $event"
                  />
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
                      {{ mode }}
                    </b-button>
                  </b-button-group>
                </b-col>

                <b-col>
                  <standard-input
                    :options="executionWindowInputOptions()"
                    @changedValue="windowSize = $event"
                  />
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
                </b-col>
                <b-col>
                  <standard-input
                    :options="gasLimitInputOptions()"
                    @changedValue="futureGasLimit = $event"
                  />
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

const TIME_BOUNTY_PRESETS = [0.02, 0.04, 0.08];
const SUPPORTED_MODES = ['Date & Time', 'Block Number'];

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
      futureGasLimit: '21000',
      futureGasPrice: '1',
      data: '',
      datetime: '',
      currentBlockNumber: '',
      selectedBlockNumber: '',
      timeBountyPresets: TIME_BOUNTY_PRESETS,
      timeBounty: TIME_BOUNTY_PRESETS[0],
      timeBountyUsd: '0',
      windowSize: 90,
      supportedModes: SUPPORTED_MODES,
      selectedMode: SUPPORTED_MODES[0],
      deposit: TIME_BOUNTY_PRESETS[0] * 2,
      amountInputOptions() {
        return {
          title: 'Amount',
          value: this.amount
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
          value: this.timeBounty
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
          placeHolder: `Current block number: ${this.currentBlockNumber}`
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
          value: this.futureGasLimit
        };
      },
      futureGasPriceInputOptions() {
        return {
          title: 'Future Gas Price (gwei)',
          value: this.gasPrice
        };
      },
      futureGasLimitInputOptions() {
        return {
          title: 'Future Gas Limit',
          value: this.futureGasLimit,
          inputDisabled: true
        };
      },
      requireDepositInputOptions() {
        return {
          title: 'Require a deposit',
          value: this.deposit
        };
      },
      executionWindowInputOptions() {
        return {
          title: 'Execution Window',
          value: this.windowSize
        };
      }
    };
  },
  computed: {
    ...mapGetters(['web3', 'network', 'wallet', 'gasPrice']),
    now() {
      return new Date();
    },
    validInputs() {
      return (
        // this.isValidAmount &&
        this.isValidAddress // &&
        // new BigNumber(this.gasLimit).gte(0) &&
        // Misc.validateHexString(this.data)
      );
    },
    isValidAddress() {
      if (this.toAddress !== '' && this.toAddress.length !== 0 && isAddress(this.toAddress)) {
        return true;
      }
      return false;
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
    this.futureGasPrice = this.gasPrice;
  },
  methods: {
    scheduleTx: async function() {
      const {
        toAddress,
        amount,
        futureGasLimit,
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

      const ethToWeiBN = value =>
        new BigNumber(this.web3.utils.toWei(value.toString(), 'ether'));

      const schedulingOptions = {
        toAddress,
        windowStart: new BigNumber(
          timestampScheduling ? timestamp : selectedBlockNumber
        ),
        timestampScheduling,
        callGas: new BigNumber(futureGasLimit),
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

      const receipt = await eac.validateScheduleOptions(schedulingOptions);

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
