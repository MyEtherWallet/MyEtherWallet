<template>
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    :valid-networks="validNetworks"
    top-strip
  >
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import { STAKEWISE_ROUTES } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { mapActions, mapGetters, mapState } from 'vuex';
import handler from './handlers/stakewiseHandler';
import BigNumber from 'bignumber.js';
import { fromWei } from 'web3-utils';
import rEthAbi from '@/dapps/stakewise/handlers/abi/rewardEthToken';
import sEthAbi from '@/dapps/stakewise/handlers/abi/stakedEthToken';
import {
  SETH2_MAINNET_CONTRACT,
  RETH2_MAINNET_CONTRACT,
  SETH2_GOERLI_CONTRACT,
  RETH2_GOERLI_CONTRACT
} from '@/dapps/stakewise/handlers/configs.js';

export default {
  name: 'TheStakewiseLayout',
  components: {
    TheWrapperDapp
  },
  data() {
    return {
      header: {
        title: 'Stakewise',
        subtext: 'Stake any amount of ETH and begin earning rewards.'
      },
      activeTab: 0,
      tabs: [
        {
          name: 'Stake ETH',
          route: { name: STAKEWISE_ROUTES.CORE.NAME },
          id: 0
        },
        {
          name: 'Compound Rewards',
          route: {
            name: STAKEWISE_ROUTES.REWARDS.NAME
          },
          id: 1
        }
      ],
      headerImg: require('@/dapps/stakewise/assets/icon-stakewise-purple.svg'),
      validNetworks: SUPPORTED_NETWORKS,
      stakewiseHandler: {},
      fetchInterval: null
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    isSupported() {
      const isSupported = this.validNetworks.find(item => {
        return item.name === this.network.type.name;
      });
      return isSupported;
    },
    seth2Contract() {
      return this.isEthNetwork ? SETH2_MAINNET_CONTRACT : SETH2_GOERLI_CONTRACT;
    },
    reth2Contract() {
      return this.isEthNetwork ? RETH2_MAINNET_CONTRACT : RETH2_GOERLI_CONTRACT;
    }
  },
  watch: {
    $route(to) {
      if (to.name === STAKEWISE_ROUTES.REWARDS.NAME) {
        this.activeTab = this.tabs[1].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    },
    network: {
      handler: function () {
        if (this.isSupported) this.setup();
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.name === STAKEWISE_ROUTES.REWARDS.NAME) {
      this.activeTab = this.tabs[1].id;
    }
    if (this.isSupported) {
      this.setup();
    }
  },
  beforeDestroy() {
    clearInterval(this.fetchInterval);
  },
  methods: {
    ...mapActions('stakewise', [
      'setPoolSupply',
      'setStakingFee',
      'setValidatorApr',
      'setRewardBalance',
      'setStakeBalance'
    ]),
    setup() {
      this.stakewiseHandler = new handler(this.web3, this.isEthNetwork);
      this.collectiveFetch();
      this.fetchInterval = setInterval(() => {
        this.collectiveFetch();
      }, 14000);
    },
    collectiveFetch() {
      this.stakewiseHandler.getEthPool().then(res => {
        this.setPoolSupply(res);
      });
      this.stakewiseHandler.getStakingFee().then(res => {
        this.setStakingFee(res);
      });
      this.stakewiseHandler.getValidatorApr().then(res => {
        this.setValidatorApr(
          BigNumber(res).minus(BigNumber(res).times(0.1)).dp(2).toString()
        );
      });
      this.fetchSethBalance();
      this.fetchRethBalance();
    },
    fetchSethBalance() {
      const contract = new this.web3.eth.Contract(sEthAbi, this.seth2Contract);
      contract.methods
        .balanceOf(this.address)
        .call()
        .then(res => {
          this.setStakeBalance(fromWei(res));
        });
    },
    fetchRethBalance() {
      const contract = new this.web3.eth.Contract(rEthAbi, this.reth2Contract);
      contract.methods
        .balanceOf(this.address)
        .call()
        .then(res => {
          this.setRewardBalance(fromWei(res));
        });
    }
  }
};
</script>
