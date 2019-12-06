<template>
  <div>
    <div v-if="!ready">
      <loading-sign />
    </div>
    <div v-if="ready" class="currency-ops-new">
      <div style="padding: 10px;">
        <p>
          {{
            $t('dappsMaker.dai-savings-rate', {
              value: displayPercentValue(yearlyRate)
            })
          }}
        </p>
        <p>{{ $t('dappsMaker.deposited-amount', { value: deposited }) }}</p>
      </div>
      <div class="currency-picker-container">
        <div class="interface__block-title">
          {{ $t('dappsMaker.earn-with-dai') }}
        </div>
        <div v-if="showSetupScreen">
          <div>
            <p>
              <b> {{ $t('dappsMaker.create-vault-proxy') }}</b>
            </p>
            <p>{{ $t('dappsMaker.create-proxy-info-message') }}</p>
            <div class="buttons-container">
              <div
                :class="[
                  !proxyPresent ? '' : 'disabled',
                  'submit-button large-round-button-green-filled'
                ]"
                @click="BuildProxy"
              >
                {{ $t('dappsMaker.setup') }}
              </div>
            </div>
          </div>
          <p>
            <b> {{ $t('dappsMaker.savings-set-allowance') }}</b>
          </p>
          <p>{{ $t('dappsMaker.savings-set-allowance-info') }}</p>
          <div class="buttons-container">
            <div
              :class="[
                !hasAllowance && proxyPresent ? '' : 'disabled',
                'submit-button large-round-button-green-filled'
              ]"
              @click="setAllowance"
            >
              {{ $t('dappsMaker.set') }}
            </div>
          </div>
        </div>
        <div v-if="!showSetupScreen">
          <div class="buttons-container-alt">
            <div>
              <button
                :class="['submit-btn', showDepositDisplay ? 'active' : '']"
                @click="showDeposit(true)"
              >
                <h4>{{ $t('dappsMaker.deposit') }}</h4>
              </button>
              <button
                :class="['submit-btn', !showDepositDisplay ? 'active' : '']"
                @click="showDeposit(false)"
              >
                <h4>{{ $t('dappsMaker.withdraw') }}</h4>
              </button>
            </div>
          </div>
          <div v-if="showDepositDisplay">
            <div class="interface__block-title">
              <span> {{ $t('dappsMaker.deposit') }}</span>
              <div class="top-buttons" @click="setMaxDeposit">
                <p>{{ $t('dappsMaker.entire-dai-balance') }}</p>
              </div>
            </div>
            <div class="dropdown-text-container dropdown-container no-point">
              <p>
                <img :src="DaiIcon" class="icon-size" />
                {{ $t('dappsMaker.dai') }}
                <span class="subname"
                  >- {{ $t('dappsMaker.dai-stable-coin') }}
                </span>
              </p>
            </div>
            <input
              v-model="daiQty"
              :class="[
                'currency-picker-container',
                'dropdown-text-container',
                'dropdown-container'
              ]"
            />
            <div v-if="showErrorInfoOrOther" class="input-block-message">
              <p>
                Some Error, info, or instructions
              </p>
            </div>

            <div class="buttons-container">
              <div
                :class="[
                  validInputs && canDeposit ? '' : 'disabled',
                  'submit-button large-round-button-green-filled'
                ]"
                @click="deposit"
              >
                {{ $t('dappsMaker.deposit') }}
              </div>
            </div>
          </div>
          <div v-if="!showDepositDisplay">
            <div class="interface__block-title">
              <span> {{ $t('dappsMaker.withdraw') }}</span>
              <div class="top-buttons" @click="setMaxWithdraw">
                <p>{{ $t('dappsMaker.entire-deposit-balance') }}</p>
              </div>
            </div>
            <div class="dropdown-text-container dropdown-container no-point">
              <p>
                <img :src="DaiIcon" class="icon-size" />
                {{ $t('dappsMaker.dai') }}
                <span class="subname"
                  >- {{ $t('dappsMaker.dai-stable-coin') }}
                </span>
              </p>
            </div>
            <input
              v-model="daiQty"
              :class="[
                'currency-picker-container',
                'dropdown-text-container',
                'dropdown-container'
              ]"
            />
            <div class="buttons-container">
              <div
                :class="[
                  validInputs && canWithdraw ? '' : 'disabled',
                  'submit-button large-round-button-green-filled'
                ]"
                @click="withdraw"
              >
                {{ $t('dappsMaker.withdraw') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  addresses,
  ERC20,
  ProxyRegistry,
  toBigNumber
} from '../../makerHelpers';
import LoadingSign from '@/components/LoadingSign';
import DaiIcon from '@/assets/images/currency/coins/AllImages/DAI.svg';

import { MDAI } from '@makerdao/dai-plugin-mcd';

export default {
  components: {
    'loading-sign': LoadingSign
  },
  props: {
    ethPrice: {
      type: BigNumber,
      default: function() {
        return new BigNumber(0);
      }
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    cdps: {
      type: Array,
      default: function() {
        return [];
      }
    },
    availableCdps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cdpDetailsLoaded: {
      type: Boolean,
      default: false
    },
    getValueOrFunction: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      DaiIcon: DaiIcon,
      showDepositDisplay: true,
      setupComplete: false,
      userHasProxy: false,
      showErrorInfoOrOther: false,
      proxyAddress: null,
      daiQty: 0,
      gasLimit: -1,
      yearlyRate: 0,
      daiBalance: 0,
      deposited: 0,
      maxWithdrawable: 0,
      allowance: 0,
      daiAllowance: 0,
      proxyChecked: false,
      allowanceChecked: false
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    showSetupScreen() {
      return !this.hasAllowance || !this.proxyPresent;
    },
    validInputs() {
      return (
        toBigNumber(this.daiQty).gt(0) && this.hasEnough && this.proxyPresent
      );
    },
    hasEnough() {
      return this.daiBalance >= this.daiQty;
    },
    proxyPresent() {
      return this.proxyAddress != null;
    },
    proxyAllowance() {
      return this.proxyAddress != null;
    },
    hasAllowance() {
      return toBigNumber(this.daiAllowance).gt(0);
    },
    canWithdraw() {
      if (this.deposited) {
        return toBigNumber(this.deposited.toBigNumber()).gte(this.daiQty);
      }
      return false;
    },
    canDeposit() {
      return toBigNumber(this.daiBalance).gte(this.daiQty);
    },
    ready() {
      return this.proxyChecked && this.allowanceChecked;
    }
  },
  watch: {
    makerActive(newVal) {
      if (newVal) {
        this.setup();
      }
    }
  },
  beforeDestroy() {
    this.makerSaver = {};
  },
  async mounted() {
    const proxyReg = new this.web3.eth.Contract(
      ProxyRegistry,
      addresses.PROXY_REGISTRY
    );

    this.proxyAddress = await proxyReg.methods
      .proxies(this.account.address)
      .call();
    if (this.proxyAddress === '0x0000000000000000000000000000000000000000') {
      this.proxyAddress = null;
    }
    this.proxyChecked = true;
    this.setup();
  },
  methods: {
    async setup() {
      this.makerSaver = this.getValueOrFunction('_mcdSaving');
      this.setupComplete = this.makerSaver !== undefined;
      await this.getValues();
    },

    async getValues() {
      if (this.setupComplete) {
        this.yearlyRate = toBigNumber(await this.makerSaver.getYearlyRate())
          .minus(1)
          .toFixed(10);
        this.hasProxy();
        this.checkBalance();
        await this.depositBalance();
        this.getAllowance();
      }
      return 0;
    },
    setMaxDeposit() {
      this.daiQty = this.daiBalance;
    },
    setMaxWithdraw() {
      if (this.maxWithdrawable) {
        this.daiQty = this.maxWithdrawable;
      }
    },
    showDeposit(val) {
      this.showDepositDisplay = val;
      this.daiQty = 0;
    },
    async deposit() {
      if (this.setupComplete) {
        await this.makerSaver.join(MDAI(this.daiQty));
      }
    },
    async withdraw() {
      if (this.setupComplete) {
        await this.makerSaver.exit(MDAI(this.daiQty));
      }
    },
    async depositBalance() {
      if (this.setupComplete) {
        this.deposited = await this.makerSaver.balance();
        if (this.deposited) {
          this.maxWithdrawable = this.deposited.toBigNumber().toString();
        }
      }
    },
    async checkBalance() {
      if (this.setupComplete) {
        const balance = this.getValueOrFunction('balances');
        if (balance) {
          const daiBalance = balance['MDAI'];
          if (!daiBalance) return toBigNumber(0);
          this.daiBalance = daiBalance.toString();
          if (this.proxyAddress) {
            this.daiAllowance = await this.getAllowance();
          }
        }
      }
      return toBigNumber(0);
    },
    async hasProxy() {
      if (this.setupComplete) {
        this.proxyAddress = await this.getValueOrFunction('getProxy')();
        if (!this.proxyAddress) {
          this.proxyChecked = true;
          this.proxyAddress = null;
          return null;
        }
        this.daiAllowance = await this.getAllowance();
        this.proxyChecked = true;
        return this.proxyAddress;
      }
      this.proxyChecked = true;
      return null;
    },
    async BuildProxy() {
      if (this.setupComplete) {
        this.proxyAddress = await this.getValueOrFunction('getProxy')();
        if (!this.proxyAddress) {
          this.getValueOrFunction('_proxyService')
            .build()
            .then(() => {
              return this.getValueOrFunction('_proxyService').currentProxy();
            })
            .then(res => {
              this.proxyAddress = res;
            });
        }
      }
    },
    adapterAddress(ilk) {
      const key = 'MCD_JOIN_' + ilk.replace(/-/g, '_');
      return this.get('smartContract').getContractAddress(key);
    },
    async getAllowance() {
      if (this.proxyAddress) {
        if (this.setupComplete && this.getValueOrFunction('tokens')) {
          const val = await this.getValueOrFunction('tokens')[
            'MDAI'
          ]._contract.allowance(
            this.getValueOrFunction('account').address,
            this.proxyAddress
          );
          this.allowanceChecked = true;
          return val;
        }
        const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_DAI);

        const val = await contract.methods
          .allowance(
            this.getValueOrFunction('account').address,
            this.proxyAddress
          )
          .call();
        this.allowanceChecked = true;
        return val;
      }
      this.allowanceChecked = true;
      return 0;
    },
    async setAllowance() {
      if (this.setupComplete && this.getValueOrFunction('tokens')) {
        this.getValueOrFunction('tokens')['MDAI'].approveUnlimited(
          this.proxyAddress
        );
      }
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals).toString();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerSavings';
</style>
