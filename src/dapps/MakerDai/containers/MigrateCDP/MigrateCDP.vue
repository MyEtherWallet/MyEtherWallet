<template>
  <div>
    <div class="currency-ops-new">
      <div class="currency-picker-container">
        <div class="interface__block-title">
          Migrate Single Collateral CDP to Multi-Collateral
        </div>
        <h4 v-show="cdpDetailsLoaded">
          Loading your CDPs
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
        {{ migrationPossible }}
        <div v-show="!migrationPossible" class="input-block-message">
          <p>
            {{ $t('dappsMaker.migrationContractBalanceBelow') }}
          </p>
        </div>

        <div class="buttons-container">
          <div
            :class="[
              validInputs ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            @click="beginMigration"
          >
            migrate
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
  locateCdps,
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
    cdpDetailsLoaded: {
      type: Boolean,
      default: false
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
      migrationNotPossible: false,
      daiAddress: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
    };
  },
  computed: {
    ...mapState(['account', 'gasPrice', 'web3', 'network', 'ens']),
    migrationPossible() {
      return toBigNumber(this.daiGenerated).lt(
        toBigNumber(this.migrateContractBalance)
      );
    },
    validInputs() {
      return this.selectedCdp !== 0 && this.migrationPossible;
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
      const { withProxy, withoutProxy } = await locateCdps(
        this,
        this.getValueOrFunction('_cdpService')
      );
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
        const contractHasEnough = await this.checkMigrateContractSaiBalance(
          cdpDaiBalance
        );
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
      const details = await this.getValueOrFunction('_cdpService').getCdp(
        cdpSelected,
        this.proxyAddress
      );
      this.daiGenerated = (await details.getDebtValue()).toBigNumber();
    },
    async checkMigrateContractSaiBalance(cdpBalance = 0) {
      // 2nd layer check. if the user tries to beat the button change (valid to invalid)
      this.migrateContractBalance = await this.getMigrationContractBalance();
      if (
        toBigNumber(cdpBalance).lt(toBigNumber(this.migrateContractBalance))
      ) {
        return true;
      }
      return true; // the contract is reporting a 0 balance?
    },
    async getMigrationContractBalance() {
      return 2;
      // return await new this.web3.eth.Contract(ERC20, this.daiAddress).methods
      //   .balanceOf(addresses.MIGRATION)
      //   .call();
      // the contract is reporting a 0 balance?
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
