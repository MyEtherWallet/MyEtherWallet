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

        <div v-show="migrationPossible" class="input-block-message">
          <p>
            Not enough Sai 'old DAI' in the Maker Migration Contract to complete
            this migration. Please try again later of contact the maker
            foundation at integrate@makerdao.com
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
  migrateABI,
  ERC20,
  ProxyContract,
  locateCdps
} from '../../makerHelpers';
import ethUnit from 'ethjs-unit';
import utils from 'web3-utils';
import { Toast } from '@/helpers';

const KOVAN_SERVER_URL = 'https://sai-kovan.makerfoundation.com/v1';

// eslint-disable-next-line

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
    // cdps: {
    //   type: Array,
    //   default: function() {
    //     return [];
    //   }
    // },
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
      proxyAddress: ''
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
      return this.selectedCdp !== 0;
    }
  },
  watch: {
    $route: 'setup',
    makerActive: 'setup'
  },
  async mounted() {
    this.setup();
    console.log(this.cdps); // todo remove dev item
  },
  methods: {
    setup() {
      if (this.makerActive) {
        this.migrateContractBalance = 0;
        this.getProxy = this.getValueOrFunction('getProxy');
        this.proxyAllowances = this.getValueOrFunction('proxyAllowances');
        this.findCdps();
        this.getMigrateContractSaiBalance();
      }
    },
    async checkAllowance(tokenAddress) {
      const contract = new this.web3.eth.Contract(ERC20, tokenAddress);
      return contract.methods
        .allowance(this.account.address, this.proxyAddress)
        .call();
    },
    async findCdps() {
      const { withType, withProxy, withoutProxy } = await locateCdps(
        this,
        this.getValueOrFunction('_cdpService')
      );
      console.log(withType, withProxy, withoutProxy); // todo remove dev item
      this.cdps = withProxy.concat(withoutProxy);
      this.mkrAllowance = await this.checkAllowance(
        '0x1dad4783cf3fe3085c1426157ab175a6119a04ba'
      );
      console.log(this.mkrAllowance); // todo remove dev item
    },
    async beginMigration() {
      if (this.selectedCdp !== 0) {
        const txs = [];
        // console.log(this.getCdp); // todo remove dev item
        this.proxyAddress = this.getValueOrFunction('proxyAddress');
        const details = await this.getValueOrFunction('_cdpService').getCdp(
          this.selectedCdp,
          this.proxyAddress
        );

        // const fee = await details.getGovernanceFee();
        // console.log(fee.toBigNumber().toString()); // todo remove dev item
        // if(toBigNumber(this.mkrAllowance).lt(fee.toBigNumber())){
        //   txs.push(await this.approveMkr(details.governanceFeeOwed));
        // }

        txs.push(await this.approveMkr(100));

        const datas = await this.migrate(this.selectedCdp);
        txs.push(datas);
        // console.log(txs[0]); // todo remove dev item
        // console.log(txs[1]); // todo remove dev item
        console.log('datas', datas); // todo remove dev item
        // this.web3.eth
        //   .sendTransaction(datas)
        //   .then(console.log)
        //   .catch(console.error);

        this.web3.mew
          .sendBatchTransactions(txs)
          .then(console.log)
          .catch(console.error);
      }
    },
    selectCDP(cdpSelected) {
      this.selectedCdp = cdpSelected;
    },
    getMigrateContractSaiBalance() {},
    // MIGRATION CONTRACT
    // https://github.com/makerdao/scd-mcd-migration/blob/master/src/ScdMcdMigration.sol#L59
    async migrate(cdpId) {
      /*

// example:
0x1cff79cd
00000000000000000000000017134c5ab1ea28f21df9c8203b817bd3b9f9a12d
0000000000000000000000000000000000000000000000000000000000000040
0000000000000000000000000000000000000000000000000000000000000044
d25d7cc000000000000000000000000097cb5a9abcdbe291d0cd85915fa5b087
46fe948a00000000000000000000000000000000000000000000000000000000
00001a5b00000000000000000000000000000000000000000000000000000000


0x1cff79cd
00000000000000000000000097cb5a9abcdbe291d0cd85915fa5b08746fe948a
0000000000000000000000000000000000000000000000000000000000000040
0000000000000000000000000000000000000000000000000000000000000024
e19b8ee336383537000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000

* * */

      //TODO use seth to get tokens (MCD_GOV is maker address for deployments)
      // TODO: look at and follow: https://github.com/makerdao/developerguides/blob/master/mcd/upgrading-to-multi-collateral-dai/cli-mcd-migration.md#migrating-cdps
      const proxy = new this.web3.eth.Contract(
        ProxyContract,
        this.proxyAddress
      );

      const contract = new this.web3.eth.Contract(
        migrateABI,
        addresses.MIGRATION
      );

      console.log(cdpId); // todo remove dev item
      const cdpId2 = utils.fromAscii(cdpId.toString());

      console.log(cdpId2); // todo remove dev item
      const dataOrig = contract.methods.migrate(cdpId2).encodeABI();

      console.log(dataOrig); // todo remove dev item
      const data = proxy.methods
        .execute(addresses.MIGRATION_PROXY_ACTIONS, dataOrig)
        .encodeABI();

      console.log('dataOrig', dataOrig); // todo remove dev item
      console.log('data', data); // todo remove dev item
      return {
        from: this.account.address,
        to: this.proxyAddress,
        value: 0,
        gas: 5000000,
        data: data
      };
    },
    async approveMkr() {
      // SAI_MKR: '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd'

      // const tokenAddress = '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd';
      const tokenAddress = '0x1dad4783cf3fe3085c1426157ab175a6119a04ba';

      const contract = new this.web3.eth.Contract(ERC20, tokenAddress);

      const mkrBalance = await contract.methods
        .balanceOf(this.account.address)
        .call();

      // was getting a too big decimal error.  So, just approve the entire maker balance
      console.log(mkrBalance); // todo remove dev item
      const val = ethUnit.toWei(mkrBalance, 'ether').toString();
      const data = contract.methods
        .approve(addresses.MIGRATION_PROXY_ACTIONS, val)
        .encodeABI();

      return {
        from: this.account.address,
        to: tokenAddress,
        value: 0,
        data: data
      };
    },
    async approve(val) {
      // const tokenAddress = '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd';
      const tokenAddress = '0x1dad4783cf3fe3085c1426157ab175a6119a04ba';
      const contract = new this.web3.eth.Contract(ERC20, tokenAddress);

      const data = contract.methods
        .approve(addresses.MIGRATION_PROXY_ACTIONS, val)
        .encodeABI();

      return {
        from: this.account.address,
        to: tokenAddress,
        value: 0,
        data: data
      };
    },
    async buildProxyContractCall(mainData) {
      /*
        execute(contract, method, args, options, address) {
    if (!address && typeof this._currentProxy !== 'string') {
      throw new Error('No proxy found for current account');
    }
    const proxyAddress = address ? address : this._currentProxy;
    const proxyContract = this.getUnwrappedProxyContract(proxyAddress);
    const data = contract.interface.functions[method](...args).data;
    return proxyContract.execute(contract.address, data, options);
  }
      */
      console.log(mainData); // todo remove dev item
      const proxyAddress = this.proxyAddress.toLowerCase();

      const contract = new this.web3.eth.Contract(ProxyContract, proxyAddress);

      const data = contract.methods
        .execute(addresses.MIGRATION_PROXY_ACTIONS, mainData)
        .encodeABI();

      return {
        from: this.account.address,
        to: proxyAddress,
        value: 0,
        data: data
      };
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
