<template>
  <div class="schedule-transaction-container">
    <b-container>
      <b-row align-h="start">
        <b-col cols="4"> <back-button /> </b-col>

        <b-col class="vertical-center-self horizontal-center" cols="4">
          <h2>Schedule a transaction</h2>
        </b-col>
      </b-row>
    </b-container>
    <div class="schedule-transaction-content">
      <div class="schedule-transaction-form-container">
        <standard-input :options="amountInputOptions()" v-model="amount" />
        <div class="form-block">
          <standard-input
            :options="toAddressInputOptions()"
            v-model="toAddress"
          />

          <hr />

          <b-container class="mode-container">
            <b-row>
              <b-col>
                <div :class="selectedMode === supportedModes[0] && 'hide'">
                  <standard-input
                    :options="blockNumberInputOptions()"
                    v-model="selectedBlockNumber"
                  />
                </div>

                <div
                  :class="[
                    'datetime-picker-container',
                    selectedMode === supportedModes[1] && 'hide'
                  ]"
                >
                  <div class="input-title">Date & Time</div>
                  <datetime-picker
                    v-model="datetime"
                    :min-datetime="now.toISOString()"
                    class="theme-mew"
                    type="datetime"
                  />
                </div>
              </b-col>

              <b-col class="mode-btn-col">
                <b-button-group class="float-right">
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
            </b-row>
          </b-container>

          <hr />

          <b-container class="send-form advanced">
            <b-row>
              <b-col>
                <p>Time Bounty</p>
                <div :class="advancedExpand && 'hide'">
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

                <div :class="!advancedExpand && 'hide'">
                  <standard-input
                    :options="customTimeBountyInputOptions()"
                    v-model="timeBounty"
                  />
                </div>
              </b-col>
              <b-col>
                <div class="toggle-button-container float-right">
                  <h4>Advanced Settings</h4>
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

            <div :class="!advancedExpand && 'hide'">
              <standard-input :options="dataInputOptions()" v-model="data" />
              <b-row>
                <b-col>
                  <standard-input
                    :options="gasLimitInputOptions()"
                    v-model="gasLimit"
                  />
                </b-col>
                <b-col>
                  <standard-input :options="futureGasLimitInputOptions()" />
                </b-col>
              </b-row>
              <standard-input
                :options="requireDepositInputOptions()"
                v-model="deposit"
              />
              <standard-input
                :options="executionWindowInputOptions()"
                v-model="windowSize"
              />
            </div>
          </b-container>
        </div>
      </div>
    </div>

    <div class="submit-button-container">
      <div
        :class="['submit-button large-round-button-green-filled']"
        @click="scheduleTx"
      >
        Schedule
      </div>
      <interface-bottom-text
        :link-text="$t('interface.helpCenter')"
        :question="$t('interface.haveIssues')"
        link="https://www.ethereum-alarm-clock.com"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EAC } from '@ethereum-alarm-clock/lib';
import BigNumber from 'bignumber.js';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import CurrencyPicker from '../../layouts/InterfaceLayout/components/CurrencyPicker';
import StandardInput from '@/components/StandardInput';

const TIME_BOUNTY_PRESETS = [0.02, 0.04, 0.08];
const SUPPORTED_MODES = ['Minutes', 'Block Number'];

export default {
  name: 'ScheduleTransaction',
  components: {
    'back-button': BackButton,
    'interface-bottom-text': InterfaceBottomText,
    'currency-picker': CurrencyPicker,
    'standard-input': StandardInput,
    'datetime-picker': Datetime
  },
  data() {
    return {
      advancedExpand: false,
      advancedTimeBounty: false,
      isValidAddress: false,
      toAddress: '',
      amount: '0',
      gasLimit: '21000',
      data: '',
      datetime: '',
      currentBlockNumber: '',
      selectedBlockNumber: '',
      timeBountyPresets: TIME_BOUNTY_PRESETS,
      timeBounty: TIME_BOUNTY_PRESETS[0],
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
          placeHolder: 'ETH',
          value: this.timeBounty
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
          value: this.gasLimit
        };
      },
      futureGasLimitInputOptions() {
        return {
          title: 'Future Gas Limit',
          value: this.gasLimit,
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
    ...mapGetters(['web3', 'network', 'wallet']),
    now() {
      return new Date();
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
  },
  methods: {
    scheduleTx: async function() {
      const {
        toAddress,
        amount,
        gasLimit,
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
        callGas: new BigNumber(gasLimit),
        callData: data,
        callValue: ethToWeiBN(amount),
        windowSize: new BigNumber(windowSize),
        bounty: ethToWeiBN(timeBounty),
        requiredDeposit: ethToWeiBN(deposit)
      };
      console.log(schedulingOptions);

      const receipt = await eac.schedule(schedulingOptions);

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
