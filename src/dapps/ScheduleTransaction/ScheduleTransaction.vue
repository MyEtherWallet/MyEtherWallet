<template>
  <div class="schedule-transaction-container">
    <back-button />
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

                <div :class="selectedMode === supportedModes[1] && 'hide'">
                  Time
                </div>
              </b-col>

              <b-col>
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

          <b-container class="timebounty-container">
            <b-row>
              <b-col>
                <p>Time Bounty</p>
                <div :class="advancedTimeBounty && 'hide'">
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

                <div :class="!advancedTimeBounty && 'hide'">
                  <standard-input
                    :options="customTimeBountyInputOptions()"
                    v-model="timeBounty"
                  />
                </div>
              </b-col>

              <b-col>
                <div class="toggle-button-container float-right">
                  <h4>Advanced Time Bounty</h4>
                  <div class="toggle-button">
                    <!-- Rounded switch -->
                    <div class="sliding-switch-white">
                      <label class="switch">
                        <input
                          type="checkbox"
                          @click="advancedTimeBounty = !advancedTimeBounty"
                        />
                        <span class="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-container>

          <hr />

          <div class="send-form advanced">
            <div class="advanced-content">
              <div class="toggle-button-container">
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

              <b-container :class="!advancedExpand && 'hide'">
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
              </b-container>
            </div>
          </div>

          <hr />

          <div
            class="submit-button large-round-button-green-filled clickable"
            @click="scheduleTx"
          >
            Schedule
          </div>
        </div>
      </div>
      <div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://www.ethereum-alarm-clock.com/"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EAC } from '@ethereum-alarm-clock/lib';
import BigNumber from 'bignumber.js';

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
    'standard-input': StandardInput
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
          value: this.toAddress
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
    ...mapGetters(['web3', 'network', 'wallet'])
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
        selectedMode
      } = this;

      const eac = new EAC(this.web3);
      const now = Math.round(new Date().getTime() / 1000);
      const oneDayFromNow = now + 24 * 60 * 60;

      const timestampScheduling = selectedMode === SUPPORTED_MODES[0];

      const ethToWeiBN = value =>
        new BigNumber(this.web3.utils.toWei(value.toString(), 'ether'));

      const schedulingOptions = {
        toAddress,
        windowStart: new BigNumber(
          timestampScheduling ? oneDayFromNow : selectedBlockNumber
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
