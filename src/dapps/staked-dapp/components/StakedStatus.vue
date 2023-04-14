<template>
  <!--
    ===================================================
    Staked Status Tab
    ===================================================
    -->
  <div class="staked-status-container mx-auto">
    <mew-popup
      max-width="690px"
      :show="openWithdrawalModal"
      :has-buttons="false"
      :has-body-content="true"
      :title="modalTitle"
      :left-btn="leftBtn"
    >
      <div>
        <!-- Step 1: Ask user for execution address -->
        <div v-if="step === 1" class="text-center">
          <div class="mew-heading-3 mb-3 text-left">
            Your Withdrawal Address
          </div>
          <module-address-book
            ref="addressInput"
            class="AddressInput"
            label="Address"
            :preselect-curr-wallet-adr="true"
            :currency="currencyName"
            @setAddress="setAddress"
          />
        </div>
        <!-- Step 2: Ask user for wallet type -->
        <div v-if="step === 2" class="text-center">
          <div v-for="(btn, key) in buttons" :key="key" class="mb-5">
            <mew-button
              :class="btn.class"
              has-full-width
              color-theme="greyMedium"
              btn-style="outline"
              style="height: 160px"
              @click.native="btn.fn"
            >
              <div
                class="text-left d-flex align-center justify-space-between px-2"
                style="width: 100%"
              >
                <div class="mew-heading-2 textDark--text">
                  {{ btn.label }}
                </div>
                <img
                  width="80"
                  class="mr-4 d-none d-sm-block"
                  :src="btn.icon"
                />
              </div>
            </mew-button>
          </div>
          <input
            ref="jsonInput"
            type="file"
            name="file"
            style="display: none"
            @change="uploadFile"
          />
        </div>
        <!-- Step 3: Ask user for wallet inputs -->
        <div v-if="step === 3" class="text-center">
          <!--
          ===================================================
          Keystore
          ===================================================
          -->
          <div v-if="isKeystore">
            <mew-input
              ref="passwordInput"
              v-model="password"
              label="Enter Password"
              placeholder="Enter my keystore password"
              type="password"
            />
          </div>
          <!--
          ===================================================
          Mnemonic
          ===================================================
          -->
          <div v-if="isMnemonic">
            <!--
          =====================================================================================
            Enter Phrase Block
          =====================================================================================
          -->
            <phrase-block class="mb-8">
              <v-row>
                <v-col
                  v-for="n in length"
                  :key="`mnemonicInput${n}`"
                  cols="6"
                  lg="3"
                  md="3"
                  sm="4"
                >
                  <v-text-field
                    :ref="`mnemonicInput${n}`"
                    v-model="phrase[n]"
                    :name="`mnemonicInput${n}`"
                    :label="`${n}.`"
                    autocomplete="off"
                    :autofocus="n === 1"
                  ></v-text-field>
                </v-col>
              </v-row>
            </phrase-block>
          </div>
        </div>
        <!-- Step 4: Warning -->
        <div v-if="step === 4" class="mb-2">
          <mew-sheet class="pa-4">
            <div class="mew-heading-3 black--text">
              Setting address: {{ executionAddress }} as the withdrawal address.
            </div>
          </mew-sheet>
          <mew-warning-sheet
            class="mt-4 mb-0"
            title="Please verify"
            description="The withdrawal address can only be set once. Please make sure you are setting the correct address."
          />
        </div>
        <!-- Next and Back Buttons -->
        <div class="mb-2 text-center d-flex align-center justify-center">
          <mew-button
            v-if="step > 1"
            class="mr-2"
            title="Back"
            btn-style="outline"
            btn-size="xlarge"
            @click.native="
              () => {
                back();
              }
            "
          />
          <mew-button
            v-if="step != 2"
            :title="nextButton.title"
            :disabled="nextButton.disabled"
            :loading="loadingButton"
            btn-size="xlarge"
            @click.native="
              () => {
                nextButton.fn();
              }
            "
          />
        </div>
      </div>
    </mew-popup>
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
          (allPendingValidators.length === 0 && activeValidators.length === 0)
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
                v-if="pending.ethVmUrl && !onGoerli"
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
                · Average APR {{ active.averageApr }}
              </div>
              <mew-button
                class="mt-1"
                title="Add withdrawal address"
                :disabled="active.withdrawal_credentials_are_eth1Address"
                btn-size="medium"
                @click.native="
                  () => {
                    openModal(active);
                  }
                "
              />
            </div>
          </div>
          <div>
            <a
              rel="noopener noreferrer"
              class="font-weight-medium"
              :href="active.url"
              target="_blank"
              >View Eth2 address
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
import {
  keystoreToBLSExecution,
  mnemonicToBLSExecution
} from '@myetherwallet/eth2-keystore';

import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import {
  formatFloatingPointValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import { STATUS_TYPES } from '@/dapps/staked-dapp/handlers/handlerStaked';
import { GOERLI } from '@/utils/networks/types';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { SOFTWARE_WALLET_TYPES } from '@/modules/access-wallet/software/handlers/helpers.js';

import iconETHNavy from '@/assets/images/currencies/eth-dark-navy.svg';
import { isEmpty } from 'lodash';

export default {
  components: {
    phraseBlock: () => import('@/components/PhraseBlock'),
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook')
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
    }
  },
  data() {
    return {
      iconETHNavy: iconETHNavy,
      expanded: 0,
      STATUS_TYPES: STATUS_TYPES,
      openWithdrawalModal: false,
      selectedValidator: null,
      step: 1,
      executionAddress: '',
      isValidAddress: false,
      selectedRecoveryType: '',
      file: {},
      password: '',
      blsExecution: '',
      phrase: {},
      length: 24,
      loadingButton: false
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('global', ['preferredCurrency']),
    ...mapState('external', ['currencyRate']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'getFiatValue']),
    nextButton() {
      const obj = {
        title: 'Next',
        disabled: false,
        fn: this.nextStep
      };
      if (this.step === 1) {
        return Object.assign({}, obj, {
          disabled: !this.isValidAddress && this.executionAddress !== '',
          fn: this.nextStep
        });
      }
      if (this.step === 3) {
        if (this.isKeystore) {
          return Object.assign({}, obj, {
            disabled: this.loadingButton || !this.validPassword,
            fn: this.validateUserInputs
          });
        }

        return Object.assign({}, obj, {
          disabled: !this.isValidMnemonic,
          fn: this.validateUserInputs
        });
      }
      if (this.step === 4) {
        return Object.assign({}, obj, {
          title: 'Set withdrawal address',
          disabled: false,
          fn: this.setWithdrawalAddress
        });
      }

      return obj;
    },
    phraseToLength() {
      const phrase = Object.values(this.phrase);
      if (phrase.length > this.length) phrase.length = this.length;
      return phrase;
    },
    isValidMnemonic() {
      return this.phraseToLength.length === this.length;
    },
    parsedPhrase() {
      return this.phraseToLength.join(' ').toLowerCase();
    },
    /**
     * @returns array
     * returns button configs
     */
    buttons() {
      return [
        /* Keystore Button */
        {
          label: 'Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg'),
          fn: () => {
            this.userSelectFile();
          }
        },
        /* Mnemonic */
        {
          label: 'Mnemonic Phrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg'),
          fn: () => {
            this.setType(SOFTWARE_WALLET_TYPES.MNEMONIC);
          }
        }
      ];
    },
    /**
     * @returns string
     * returns currency name from current selected network
     */
    currencyName() {
      return this.network.type.currencyName;
    },
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
      return this.validatorsRaw.reduce((acc, raw) => {
        if (
          raw.status.toLowerCase() === STATUS_TYPES.ACTIVE ||
          raw.status.toLowerCase() === STATUS_TYPES.EXITED
        ) {
          const totalBalanceETH = this.convertToEth1(
            raw.detailed_balance_info.balance,
            raw.detailed_balance_info.conversion_factor_power
          );
          const earning = new BigNumber(totalBalanceETH).minus(raw.amount);
          acc.push(
            Object.assign({}, raw, {
              url:
                configNetworkTypes.network[this.network.type.name].url +
                '0x' +
                raw.address,
              earned: formatFloatingPointValue(earning).value,
              totalBalanceETH: formatFloatingPointValue(totalBalanceETH).value,
              totalBalanceFiat: this.getFiatValue(
                new BigNumber(totalBalanceETH).times(this.fiatValue)
              ),
              averageApr: formatPercentageValue(
                this.getAverageApr(
                  raw.activation_timestamp,
                  earning,
                  raw.amount
                )
              ).value
            })
          );
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
    },
    /**
     * @returns object
     * Returns the left button config for
     * mew popup
     */
    leftBtn() {
      return {
        text: 'Cancel',
        color: 'basic',
        method: this.closeModal
      };
    },
    /**
     * @returns string
     * Returns title based on current step
     */
    modalTitle() {
      return this.step === 1
        ? 'Provide withdrawal address'
        : this.step === 2
        ? 'Choose recovery method'
        : this.step === 3 && this.isKeystore
        ? 'Enter Keystore Password'
        : this.step === 3 && this.isMnemonic
        ? 'Enter Mnemonic Phrase'
        : this.step === 4
        ? 'Verify details'
        : '';
    },
    /**
     * @returns boolean
     * returns whether selected recovery is keystore
     */
    isKeystore() {
      return this.selectedRecoveryType === SOFTWARE_WALLET_TYPES.KEYSTORE;
    },
    /**
     * @returns boolean
     * returns whether selected recovery is keystore
     */
    isMnemonic() {
      return this.selectedRecoveryType === SOFTWARE_WALLET_TYPES.MNEMONIC;
    },
    validPassword() {
      return this.password.length > 3;
    }
  },
  watch: {
    phrase: {
      deep: true,
      handler: function (newval) {
        if (newval && !isEmpty(newval) && !isEmpty(newval[1])) {
          this.checkPhrase(newval);
          const splitVal = newval[1].split(' ');
          if (splitVal.length === 12 || splitVal.length === 24) {
            this.length = splitVal.length;
            const newObj = {};
            splitVal.forEach((item, idx) => {
              newObj[idx + 1] = item.toLowerCase();
            });
            this.phrase = newObj;
          }
        }
      }
    }
  },
  methods: {
    convertTotalReward(balance, decimal) {
      const convertedBalance = BigNumber(balance)
        .div(BigNumber(10).pow(decimal))
        .toString();
      if (convertedBalance.length > 10) {
        return `${convertedBalance.slice(0, 9)}...`;
      }
      return convertedBalance;
    },
    setWithdrawalAddress() {
      // fetch('', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify([this.blsExecution])
      // })
      //   .then(res => res.json())
      //   .then(response => {
      //     if (response.message) {
      //       Toast(response.message, {}, ERROR);
      //     } else {
      //       Toast('Successfully set withdrawal address!', {}, SUCCESS);
      //     }
      //     this.reset();
      //   });
      Toast('Successfully set withdrawal address!', {}, SUCCESS);
      this.reset();
    },
    checkPhrase(val) {
      const testObj = {};
      let changed = false;
      Object.values(val).forEach((item, idx) => {
        if (!isEmpty(item)) testObj[idx + 1] = item.toLowerCase();
        else changed = true;
      });
      if (changed) this.phrase = testObj;
    },
    /**
     * takes the keystore inputs
     * and checks if valid
     */
    async validateUserInputs() {
      this.loadingButton = true;
      try {
        this.validating = true;
        const selectedNetwork =
          this.network.type.name === 'ETH' ? 'mainnet' : 'goerli';
        if (this.isKeystore) {
          this.blsExecution = await keystoreToBLSExecution(
            this.file,
            this.password,
            this.executionAddress,
            this.selectedValidator.id,
            `0x${this.selectedValidator.decoded.withdrawal_credentials}`,
            selectedNetwork
          );
        } else {
          this.blsExecution = await mnemonicToBLSExecution(
            {
              mnemonic: this.parsedPhrase
            },
            this.executionAddress,
            this.selectedValidator.id,
            `0x${this.selectedValidator.decoded.withdrawal_credentials}`,
            selectedNetwork
          );
        }
        this.loadingButton = false;
        this.nextStep();
      } catch (err) {
        this.loadingButton = false;
        Toast(err, {}, ERROR);
        this.reset();
      }
    },
    reset() {
      if (this.$refs.addressInput) {
        this.$refs.addressInput.clear();
      }
      this.openWithdrawalModal = false;
      this.selectedValidator = null;
      this.step = 1;
      this.executionAddress = this.address;
      this.isValidAddress = false;
      this.selectedRecoveryType = '';
      this.file = {};
      this.password = '';
      this.blsExecution = '';
      this.phrase = {};
    },
    /**
     * sets selected wallet
     */
    setType(type) {
      this.selectedRecoveryType = type;
      this.nextStep();
    },
    /**
     * upload keystore
     */
    uploadFile(e) {
      const reader = new FileReader();
      reader.onloadend = evt => {
        try {
          this.file = JSON.parse(evt.target.result);
          this.setType(SOFTWARE_WALLET_TYPES.KEYSTORE);
        } catch (err) {
          Toast(err.message, {}, ERROR);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    },
    userSelectFile() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    /**
     * Increments stepper
     */
    nextStep() {
      this.step += 1;
    },
    /**
     * Increments stepper
     */
    back() {
      const jsonInput = this.$refs.jsonInput;
      switch (this.step) {
        case 2:
          this.selectedRecoveryType = '';
          jsonInput.value = '';
          break;
        case 3:
          this.password = '';
          this.phrase = {};
          this.file = {};
          break;
        default:
          break;
      }
      this.step -= 1;
    },
    /**
     * Sets address passed from addressbook
     */
    setAddress(addr, isValidAddress) {
      this.executionAddress = addr;
      this.isValidAddress = isValidAddress;
    },
    /**
     * Open modal and set selected validator
     */
    openModal(validator) {
      this.selectedValidator = validator;
      this.openWithdrawalModal = true;
    },
    /**
     * Close modal and clear selected validator
     */
    closeModal() {
      this.reset();
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
      return this.network.type.name === GOERLI.name;
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
