<template>
  <div>
    <div class="currency-ops-new">
      <div class="currency-picker-container">
        <div class="interface__block-title">
          dai savings rate
        </div>
        {{ yearlyRate }}
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
              @click="submitTransaction"
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
              @click="submitTransaction"
            >
              Withdraw
            </div>
          </div>
        </div>
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
import { addresses, migrateABI, ERC20 } from '../../makerHelpers';
import ethUnit from 'ethjs-unit';
import { Toast } from '@/helpers';

// const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';

const toBigNumber = num => {
  return new BigNumber(num);
};

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
      daiQty: 0,
      gasLimit: -1,
      yearlyRate: 0
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    validInputs() {
      return toBigNumber(this.daiQty).gt(0);
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
        this.yearlyRate = toBigNumber(
          await this.makerSaver.getYearlyRate()
        ).toFixed(10);
      }
      return 0;
    },
    showDeposit(val){
      this.showDepositDisplay = val;
    },
    // MIGRATION CONTRACT
    // https://github.com/makerdao/scd-mcd-migration/blob/master/src/ScdMcdMigration.sol#L59
    async deposit(val) {
      await this.makerSaver.join(val)
    },
    async withdraw(val) {
      await this.makerSaver.exit(val)
      // const contract = new this.web3.eth.Contract(
      //   migrateABI,
      //   addresses.MIGRATION
      // );
      //
      // const data = contract.methods.swapSaiToDai(val).encodeABI();
      // return {
      //   from: this.account.address,
      //   to: addresses.MIGRATION,
      //   value: 0,
      //   gas: 500000,
      //   data: data
      // };
    },
    async approve(val) {
      const tokenAddress = '0xc4375b7de8af5a38a93548eb8453a498222c4ff2';

      const contract = new this.web3.eth.Contract(ERC20, tokenAddress);

      const data = contract.methods
        .approve(addresses.MIGRATION, val)
        .encodeABI();

      return {
        from: this.account.address,
        to: tokenAddress,
        value: 0,
        data: data
      };
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
