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
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['isEthNetwork'])
  },
  watch: {
    $route(to) {
      if (to.name === STAKEWISE_ROUTES.REWARDS.NAME) {
        this.activeTab = this.tabs[1].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    }
  },
  mounted() {
    if (this.$route.name === STAKEWISE_ROUTES.REWARDS.NAME) {
      this.activeTab = this.tabs[1].id;
    }
    this.stakewiseHandler = new handler(this.web3, this.isEthNetwork);
    this.collectiveFetch();
    this.fetchInterval = setInterval(() => {
      this.collectiveFetch();
    }, 14000);
  },
  beforeDestroy() {
    clearInterval(this.fetchInterval);
  },
  methods: {
    ...mapActions('ethBlocksTxs', ['deleteEthBlockTx']),
    ...mapActions('stakewise', [
      'setPoolSupply',
      'setStakingFee',
      'setValidatorApr'
    ]),
    collectiveFetch() {
      this.stakewiseHandler.getEthPool().then(res => {
        this.setPoolSupply(res);
      });
      this.stakewiseHandler.getStakingFee().then(res => {
        this.setStakingFee(res);
      });
      this.stakewiseHandler.getValidatorApr().then(res => {
        this.setValidatorApr(res);
      });
    }
  }
};
</script>
