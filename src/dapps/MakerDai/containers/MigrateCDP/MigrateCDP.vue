<template>
  <div>
    <div class="currency-ops-new">
      <div style="padding: 10px">
        <p @click="checkMigrateContractSaiBalance">
          <b>
            {{
              $t('dappsMaker.current-sai-balance', {
                value: migrateContractBalance
              })
            }}</b
          >
        </p>
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
        <div class="interface__block-title">
          {{ $t('dappsMaker.migrate-single-collateral-to-multi-collateral') }}
        </div>
        <h4 v-show="!cdpDetailsLoaded">
          {{ $t('dappsMaker.loading-your-cdps') }}
        </h4>
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
              <span class="subname">- CDP </span>
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
import {
  addresses,
  ERC20,
  ProxyContract,
  locateOldCdps,
  MigrationProxyActions
} from '../../makerHelpers';
import ethUnit from 'ethjs-unit';
import { Toast } from '@/helpers';

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
      needsAtLeast20: false,
      daiAddress: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    migrationPossible() {
      return (
        toBigNumber(this.daiGenerated).lt(
          toBigNumber(this.migrateContractBalance)
        ) && !this.cdpDetailsLoaded
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
    //TODO use seth to get tokens (MCD_GOV is maker address for deployments)
    // TODO: look at and follow: https://github.com/makerdao/developerguides/blob/master/mcd/upgrading-to-multi-collateral-dai/cli-mcd-migration.md#migrating-cdps
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
            const txs = [];
            const approve = await this.approveMkr(_governanceFee);
            txs.push(approve);
            const migrate = await this.migrate(this.selectedCdp, cdpDaiBalance);
            txs.push(migrate);
            this.web3.mew.sendBatchTransactions(txs).catch(err => {
              Toast.responseHandler(err, Toast.ERROR);
            });
          } else {
            const migrate = await this.migrate(this.selectedCdp);
            this.web3.eth.sendTransaction(migrate).catch(err => {
              Toast.responseHandler(err, Toast.ERROR);
            });
          }
        }
      }
    },

    // MIGRATION CONTRACT
    // https://github.com/makerdao/scd-mcd-migration/blob/master/src/ScdMcdMigration.sol#L59
    async migrate(cdpId) {
      return {
        from: this.account.address,
        to: this.proxyAddress,
        value: 0,
        gas: 5000000,
        data: new this.web3.eth.Contract(
          ProxyContract,
          this.proxyAddress
        ).methods
          .execute(
            addresses.MIGRATION_PROXY_ACTIONS,
            this.fixImproperEncoding(
              new this.web3.eth.Contract(MigrationProxyActions).methods
                .migrate(
                  addresses.MIGRATION,
                  '0x' + toBigNumber(cdpId).toString(16)
                )
                .encodeABI(),
              cdpId
            )
          )
          .encodeABI()
      };
    },
    fixImproperEncoding(calldata, cdpId) {
      const parts = calldata.slice(0, calldata.length - 64);
      let cdpIdData = toBigNumber(cdpId).toString(16);
      for (let i = 0; cdpIdData.length < 64; i++) {
        cdpIdData = '0' + cdpIdData;
      }
      return parts + cdpIdData;
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
        if (toBigNumber(this.cdpBalances[this.selectedCdp]).lt(20)) {
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
        this.daiGenerated = cdpDaiBalance;
        this.cdpBalances[this.selectedCdp] = {
          balance: cdpDaiBalance,
          fee: _governanceFee
        };
      }
    },
    async checkMigrateContractSaiBalance(cdpBalance = 0) {
      // 2nd layer check. if the user tries to beat the button change (valid to invalid)
      this.migrateContractBalance = await this.getMigrationContractBalance();
      if (this.migrateContractBalance < 1) {
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
