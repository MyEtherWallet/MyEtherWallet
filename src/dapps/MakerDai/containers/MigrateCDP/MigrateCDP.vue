<template>
  <div style="max-width: 500px;">
    <div class="d-flex align-items-center mb-5">
      <h3 class="mr-2 ">
        {{ $t('dappsMCDMaker.migrate-single-collateral-to-multi-collateral') }}
      </h3>
      <img :src="DaiIcon" class="icon-size" height="26" width="26" />
    </div>
    <div>
      <div class="mb-5">
        <div class="mb-2">
          <b>{{ $t('dappsMCDMaker.migration-contract-balance') }}</b>
        </div>
        <b-form-input
          v-model="migrateContractBalance"
          readonly
          class="mb-1"
        ></b-form-input>
        <b-button variant="secondary" @click="checkMigrateContractSaiBalance">{{
          $t('dappsMCDMaker.check-balance')
        }}</b-button>
      </div>

      <div v-show="noSaiAvailable && !needsAtLeast20">
        {{ $t('dappsMCDMaker.not-enough-sai') }}
      </div>
      <div v-show="needsAtLeast20" style="padding: 10px">
        {{
          $t('dappsMCDMaker.needs-at-least-20', {
            value: migrateContractBalance
          })
        }}
      </div>
    </div>

    <div class="currency-picker-container">
      <div class="mb-2">
        <b>{{ $t('dappsMCDMaker.your-cdps') }}</b>
      </div>

      <div v-if="!cdpDetailsLoaded" class="d-flex align-items-center">
        <b-spinner class="mr-3" variant="primary" label="Spinning"></b-spinner>
        <div>
          {{ $t('dappsMCDMaker.loading-your-cdps') }}
        </div>
      </div>
      <div v-for="cdpId in cdps" :key="cdpId">
        <div
          :class="[
            'dropdown-text-container',
            'dropdown-container',
            'no-point',
            cdpId === selectedCdp ? 'selectedCDP' : ''
          ]"
          @click="selectCDP(cdpId)"
        >
          <p>
            <span class="cc DAI cc-icon cc-icon-dai currency-symbol" />
            {{ cdpId }}
            <span class="subname">- {{ $t('dappsMCDMaker.cdp') }} </span>
          </p>
        </div>
      </div>
      <div v-show="noCdpsToMigrateFound">
        {{ $t('dappsMCDMaker.no-cdps-to-migrate-found') }}
      </div>
      <p v-show="mkrNeeded">{{ $t('dappsMCDMaker.get-maker-to-migrate') }}</p>
      <div v-show="mkrNeeded" class="buttons-container">
        <div
          :class="['submit-button large-round-button-green-filled']"
          @click="getMkr"
        >
          {{ $t('dappsMCDMaker.get-mkr') }}
        </div>
      </div>
      <p v-show="approvalNeeded && !mkrNeeded">
        {{ $t('dappsMCDMaker.approve-maker-to-migrate') }}
      </p>
      <div v-show="approvalNeeded && !mkrNeeded" class="buttons-container">
        <div
          :class="['submit-button large-round-button-green-filled']"
          @click="beginMigration"
        >
          {{ $t('dappsMCDMaker.approve-maker') }}
        </div>
      </div>
      <div class="buttons-container">
        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="beginMigration"
        >
          {{ $t('dappsMCDMaker.migrate') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { addresses, ERC20, locateOldCdps } from '../../makerHelpers';
import ethUnit from 'ethjs-unit';
import { Toast } from '@/helpers';
import DaiIcon from '@/assets/images/currency/coins/AllImages/DAI.svg';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
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
    availableCdps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    getCdp: {
      type: Function,
      default: function() {}
    },
    valuesUpdated: {
      type: Number,
      default: 0
    },
    getValueOrFunction: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      DaiIcon: DaiIcon,
      cdps: [],
      daiGenerated: 0,
      migrateContractBalance: 0,
      selectedCdp: 0,
      proxyAddress: '',
      cdpBalances: {},
      migrationNotPossible: false,
      cdpDetailsLoaded: false,
      noSaiAvailable: false,
      needsAtLeast20: false,
      approvalNeeded: false,
      governanceFee: toBigNumber(0),
      mkrBalance: toBigNumber(0)
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    migrationPossible() {
      return (
        toBigNumber(this.daiGenerated).lt(
          toBigNumber(this.migrateContractBalance)
        ) &&
        this.cdpDetailsLoaded &&
        toBigNumber(this.daiGenerated).gte(20)
      );
    },
    validInputs() {
      return (
        this.selectedCdp !== 0 &&
        this.migrationPossible &&
        !this.mkrNeeded &&
        !this.approvalNeeded
      );
    },
    noCdpsToMigrateFound() {
      return this.cdps.length === 0 && this.cdpDetailsLoaded;
    },
    mkrNeeded() {
      return toBigNumber(this.mkrBalance).lt(this.governanceFee);
    }
  },
  watch: {
    $route: 'setup',
    makerActive: 'setup',
    valuesUpdated() {
      this.findCdps();
    }
  },
  async mounted() {
    this.setup();
  },
  methods: {
    setup() {
      if (this.makerActive) {
        this.migrateContractBalance = 0;
        this.maker = this.getValueOrFunction('maker');
        this._mcdManager = this.getValueOrFunction('_mcdManager');
        this.getProxy = this.getValueOrFunction('getProxy');
        this.proxyAllowances = this.getValueOrFunction('proxyAllowances');
        this.proxyAddress = this.getValueOrFunction('proxyAddress');
        this.findCdps();
        this.getMigrationContractBalance().then(
          value => (this.migrateContractBalance = value)
        );
        this.checkMigrateContractSaiBalance();
        this.getMkrBalance();
      }
    },
    async findCdps() {
      const { withProxy, withoutProxy } = await locateOldCdps(
        this,
        this.getValueOrFunction('_cdpService')
      );
      this.cdpDetailsLoaded = true;
      this.cdps = withProxy.concat(withoutProxy);
    },
    async beginMigration() {
      if (this.selectedCdp !== 0) {
        this.proxyAddress = this.getValueOrFunction('proxyAddress');
        const details = await this.getValueOrFunction('_cdpService').getCdp(
          this.selectedCdp,
          this.proxyAddress
        );
        this.getMkrBalance();
        this.governanceFee = (await details.getGovernanceFee()).toBigNumber();
        const cdpDaiBalance = (await details.getDebtValue()).toBigNumber();
        this.cdpBalances[this.selectedCdp] = { balance: cdpDaiBalance };
        const contractHasEnough = await this.checkMigrateContractSaiBalance(
          cdpDaiBalance
        );
        if (cdpDaiBalance.lt(20)) {
          this.needsAtLeast20 = true;
        }
        if (contractHasEnough) {
          this.approvalNeeded = await this.needsApproval(this.governanceFee);
          if (this.approvalNeeded) {
            const approvalAmount = toBigNumber(this.governanceFee).gt(1000000)
              ? this.governanceFee
              : 1000000;
            const approve = await this.approveMkr(approvalAmount);
            this.web3.eth.sendTransaction(approve).catch(err => {
              Toast.responseHandler(err, Toast.ERROR);
            });
          } else {
            try {
              await this.migrate(this.selectedCdp);
            } catch (e) {
              Toast.responseHandler(e, Toast.ERROR);
            }
          }
        }
      }
    },
    getMkr() {
      const mkrNeeded = this.governanceFee;
      if (toBigNumber(this.mkrBalance).lt(mkrNeeded)) {
        this.suppliedToAmount = toBigNumber(mkrNeeded)
          .minus(toBigNumber(this.mkrBalance))
          .plus(toBigNumber(mkrNeeded).times(0.01))
          .toNumber();
        if (toBigNumber(this.suppliedToAmount).lt(0.000001)) {
          this.suppliedToAmount = 0.000001;
        }
        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'MKR',
          name: 'Maker'
        };
        this.$eventHub.$emit(
          'showSwapWidgetTo',
          this.account.address,
          this.suppliedFrom,
          this.suppliedTo,
          this.suppliedToAmount
        );
      }
    },
    // MIGRATION
    async migrate(cdpId) {
      const mig = this.maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      return await mig.execute(cdpId);
    },
    async getMkrBalance() {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_GOV);

      const currentApproval = await contract.methods
        .balanceOf(this.account.address)
        .call();

      this.mkrBalance = toBigNumber(currentApproval);
    },
    async needsApproval(requiredApproval) {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_GOV);

      const currentApproval = await contract.methods
        .allowance(this.account.address, this.proxyAddress)
        .call();
      return toBigNumber(currentApproval).lt(toBigNumber(requiredApproval));
    },
    async approveMkr(value) {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_GOV);

      // was getting a too big decimal error.  So, just approve the entire maker balance
      const data = contract.methods
        .approve(this.proxyAddress, ethUnit.toWei(value, 'ether').toString())
        .encodeABI();
      return {
        from: this.account.address,
        to: addresses.MCD_GOV,
        value: 0,
        data: data
      };
    },
    async selectCDP(cdpSelected) {
      this.selectedCdp = cdpSelected;
      if (this.cdpBalances[this.selectedCdp]) {
        this.checkMigrateContractSaiBalance(
          this.cdpBalances[this.selectedCdp].balance
        );

        if (toBigNumber(this.cdpBalances[this.selectedCdp].balance).lt(20)) {
          this.needsAtLeast20 = true;
        } else {
          this.needsAtLeast20 = false;
        }
        this.daiGenerated = this.cdpBalances[this.selectedCdp];
        const details = await this.getValueOrFunction('_cdpService').getCdp(
          cdpSelected,
          this.proxyAddress
        );
        this.getMkrBalance();
        this.governanceFee = (await details.getGovernanceFee()).toBigNumber();
      } else {
        const details = await this.getValueOrFunction('_cdpService').getCdp(
          cdpSelected,
          this.proxyAddress
        );
        this.getMkrBalance();
        this.governanceFee = (await details.getGovernanceFee()).toBigNumber();
        const cdpDaiBalance = (await details.getDebtValue()).toBigNumber();
        this.checkMigrateContractSaiBalance(cdpDaiBalance);
        if (cdpDaiBalance.lt(20)) {
          this.needsAtLeast20 = true;
        } else {
          this.needsAtLeast20 = false;
        }
        this.daiGenerated = cdpDaiBalance.toString();
        this.cdpBalances[this.selectedCdp] = {
          balance: cdpDaiBalance,
          fee: this.governanceFee
        };
        this.approvalNeeded = await this.needsApproval(
          this.governanceFee || 1000000
        );
      }
    },
    async checkMigrateContractSaiBalance(cdpBalance = 0) {
      // 2nd layer check. if the user tries to beat the button change (valid to invalid)
      this.migrateContractBalance = await this.getMigrationContractBalance();
      if (toBigNumber(this.migrateContractBalance).lt(20)) {
        this.noSaiAvailable = true;
        return false;
      }
      if (
        toBigNumber(cdpBalance).lt(toBigNumber(this.migrateContractBalance))
      ) {
        return true;
      }
      return false; // the contract is reporting a 0 balance?
    },
    async getMigrationContractBalance() {
      const val = await new this.web3.eth.Contract(ERC20, addresses.SAI).methods
        .balanceOf(addresses.MCD_JOIN_SAI)
        .call();
      return ethUnit.fromWei(val, 'ether').toString();
    },
    async submitTransaction() {
      window.scrollTo(0, 0);
      try {
        const val = ethUnit.toWei(this.daiGenerated, 'ether').toString();
        const txs = await Promise.all([this.approve(val), this.migrate(val)]);

        this.web3.mew.sendBatchTransactions(txs).catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
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
@import 'MigrateCDP';
</style>
