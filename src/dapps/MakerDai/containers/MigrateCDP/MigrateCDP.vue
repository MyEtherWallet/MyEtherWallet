<template>
  <div style="max-width: 500px;">
    <div class="d-flex align-items-center mb-5">
      <h3 class="mr-2 ">
        {{ $t('dappsMaker.migrate-single-collateral-to-multi-collateral') }}
      </h3>
      <img :src="DaiIcon" class="icon-size" />
    </div>
    <div>
      <div class="mb-5">
        <div class="mb-2">
          <b>{{ $t('dappsMaker.current-balance') }}</b>
        </div>
        <b-form-input
          v-model="migrateContractBalance"
          readonly
          class="mb-1"
        ></b-form-input>
        <b-button variant="secondary" @click="checkMigrateContractSaiBalance">{{
          $t('dappsMaker.check-balance')
        }}</b-button>
      </div>

      <div v-show="noSaiAvailable && !needsAtLeast20">
        {{ $t('dappsMaker.not-enough-sai') }}
      </div>
      <div v-show="needsAtLeast20" style="padding: 10px">
        {{
          $t('dappsMaker.needs-at-least-20', {
            value: migrateContractBalance
          })
        }}
      </div>
    </div>

    <div class="currency-picker-container">
      <div class="mb-2">
        <b>{{ $t('dappsMaker.your-cdps') }}</b>
      </div>

      <div v-if="!cdpDetailsLoaded" class="d-flex align-items-center">
        <b-spinner class="mr-3" variant="primary" label="Spinning"></b-spinner>
        <div>
          {{ $t('dappsMaker.loading-your-cdps') }}
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
            <span class="subname">- {{ $t('dappsMaker.cdp') }} </span>
          </p>
        </div>
      </div>
      <div v-show="noCdpsToMigrateFound">
        {{ $t('dappsMaker.no-cdps-to-migrate-found') }}
      </div>
      <div class="buttons-container">
        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="beginMigration"
        >
          {{ $t('dappsMaker.migrate') }}
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
    getValueOrFunction: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      cdps: [],
      daiGenerated: 0,
      migrateContractBalance: 0,
      selectedCdp: 0,
      proxyAddress: '',
      cdpBalances: {},
      migrationNotPossible: false,
      cdpDetailsLoaded: false,
      noSaiAvailable: false,
      needsAtLeast20: false
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
      return this.selectedCdp !== 0 && this.migrationPossible;
    },
    noCdpsToMigrateFound() {
      return this.cdps.length === 0 && this.cdpDetailsLoaded;
    }
  },
  watch: {
    $route: 'setup',
    makerActive: 'setup'
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
        const _governanceFee = (await details.getGovernanceFee()).toBigNumber();
        const cdpDaiBalance = (await details.getDebtValue()).toBigNumber();
        this.cdpBalances[this.selectedCdp] = { balance: cdpDaiBalance };
        const contractHasEnough = await this.checkMigrateContractSaiBalance(
          cdpDaiBalance
        );
        if (cdpDaiBalance.lt(20)) {
          this.needsAtLeast20 = true;
        }
        if (contractHasEnough) {
          const needsApproval = await this.needsApproval(_governanceFee);
          if (needsApproval) {
            const approve = await this.approveMkr(_governanceFee);
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

    // MIGRATION
    async migrate(cdpId) {
      const mig = this.maker
        .service('migration')
        .getMigration('single-to-multi-cdp');
      return await mig.execute(cdpId);
    },
    async needsApproval(requiredApproval) {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_GOV);

      const currentApproval = await contract.methods
        .allowance(this.account.address, this.proxyAddress)
        .call();

      return currentApproval < requiredApproval;
    },
    async approveMkr() {
      const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_GOV);

      // was getting a too big decimal error.  So, just approve the entire maker balance
      const data = contract.methods
        .approve(
          this.proxyAddress,
          ethUnit
            .toWei(
              await contract.methods.balanceOf(this.account.address).call(),
              'ether'
            )
            .toString()
        )
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
      } else {
        const details = await this.getValueOrFunction('_cdpService').getCdp(
          cdpSelected,
          this.proxyAddress
        );
        const _governanceFee = (await details.getGovernanceFee()).toBigNumber();
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
          fee: _governanceFee
        };
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
