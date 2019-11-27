<template>
  <div>
    <div class="currency-ops-new">
      <div style="padding: 10px;">
        <p></p>
        <p>
          {{
            $t('dappsMaker.dai-savings-rate', {
              value: displayPercentValue(yearlyRate)
            })
          }}
        </p>
        <p>{{ deposited }}</p>
        <!--        <p>{{ daiBalance }}</p>-->
      </div>
      <div class="currency-picker-container">
        <!--        <p><b>DAI saving - Coming 27/11/2019</b></p>-->
        <!-- start -->
        <div class="interface__block-title">
          dai savings rate
        </div>

        <p>
          <button @click="showDeposit(true)">Deposit</button>
          <button @click="showDeposit(false)">Withdraw</button>
        </p>
        <div v-if="showDepositDisplay">
          <div class="interface__block-title">
            Deposit
          </div>
          <div class="dropdown-text-container dropdown-container no-point">
            <p>
              <span class="cc DAI cc-icon cc-icon-dai currency-symbol" />
              DAI
              <span class="subname">- Maker DAI </span>
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
          <div class="input-block-message">
            <p>
              Some Error, info, or instructions
            </p>
          </div>

          <div class="buttons-container">
            <div
              :class="[
                validInputs ? '' : 'disabled',
                'submit-button large-round-button-green-filled'
              ]"
              @click="deposit"
            >
              Deposit
            </div>
          </div>
        </div>
        <div v-if="!showDepositDisplay">
          <div class="interface__block-title">
            Withdraw
          </div>
          <div class="dropdown-text-container dropdown-container no-point">
            <p>
              <span class="cc DAI cc-icon cc-icon-dai currency-symbol" />
              DAI
              <span class="subname">- Maker DAI </span>
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
          <!--          <div class="input-block-message">-->
          <!--            <p>-->
          <!--              Some Error, info, or instructions-->
          <!--            </p>-->
          <!--          </div>-->

          <div class="buttons-container">
            <div
              :class="[
                validInputs ? '' : 'disabled',
                'submit-button large-round-button-green-filled'
              ]"
              @click="withdraw"
            >
              Withdraw
            </div>
          </div>
        </div>
        <!--end -->
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import SelectCdpEntry from '../../components/SelectCdpEntry';
import { addresses, ERC20, toBigNumber } from '../../makerHelpers';
import { MDAI } from '@makerdao/dai-plugin-mcd';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'select-cdp-entry': SelectCdpEntry
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
      showDepositDisplay: true,
      setupComplete: false,
      userHasProxy: false,
      proxyAddress: null,
      daiQty: 0,
      gasLimit: -1,
      yearlyRate: 0,
      daiBalance: 0,
      deposited: 0
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    validInputs() {
      return (
        toBigNumber(this.daiQty).gt(0) && this.hasEnough && this.proxyPresent
      );
    },
    hasEnough() {
      return this.daiBalance >= this.daiQty;
    },
    proxyPresent() {
      return this.hasProxy() != null;
    }
  },
  watch: {
    makerActive(newVal) {
      if (newVal) {
        this.setup();
      }
    }
  },
  async mounted() {
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
      }
      return 0;
    },
    showDeposit(val) {
      this.showDepositDisplay = val;
    },
    async deposit() {
      await this.makerSaver.join(MDAI(this.daiQty));
    },
    async withdraw() {
      await this.makerSaver.exit(MDAI(this.daiQty));
    },
    async depositBalance() {
      this.deposited = await this.makerSaver.balance();
    },
    async checkBalance() {
      if (this.setupComplete) {
        const daiBalance = this.getValueOrFunction('balances')['MDAI'];
        this.daiBalance = daiBalance.toString();
        if (this.proxyAddress) {
          this.daiAllowance = await this.getAllowance();
        }
      }
      return toBigNumber(0);
    },
    async hasProxy() {
      if (this.setupComplete) {
        this.proxyAddress = await this.getValueOrFunction('getProxy')();
        if (!this.proxyAddress) {
          this.proxyAddress = null;
          return null;
        }
        this.daiAllowance = await this.getAllowance();
        return this.proxyAddress;
      }
      return null;
    },
    async BuildProxy() {
      if (this.setupComplete) {
        this.proxyAddress = await this.getValueOrFunction('getProxy')();
        if (!this.proxyAddress) {
          await this.getValueOrFunction('_proxyService').build();
          this.proxyAddress = await this.getValueOrFunction(
            '_proxyService'
          ).currentProxy();
          return this.proxyAddress;
        }
        return this.proxyAddress;
      }
    },
    adapterAddress(ilk) {
      const key = 'MCD_JOIN_' + ilk.replace(/-/g, '_');
      return this.get('smartContract').getContractAddress(key);
    },
    async getAllowance() {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_DAI);

      return await contract.methods
        .allowance(
          this.getValueOrFunction('account').address,
          this.proxyAddress
        )
        .call();
    },
    async approve(val) {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_DAI);

      await contract.methods.approve(this.proxyAddress, val).send();

      // return {
      //   from: this.account.address,
      //   to: addresses.MCD_DAI,
      //   value: 0,
      //   data: data
      // };
    },
    async submitTransaction() {
      // window.scrollTo(0, 0);
      // try {
      //   const val = ethUnit.toWei(this.daiQty, 'ether').toString();
      //   const txs = await Promise.all([this.approve(val), this.migrate(val)]);
      //
      //   this.web3.mew.sendBatchTransactions(txs).catch(err => {
      //     Toast.responseHandler(err, Toast.ERROR);
      //   });
      // } catch (e) {
      //   Toast.responseHandler(e, Toast.ERROR);
      // }
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
