<template>
  <!--
    ===================================================
    The Staked Layout
    ===================================================
    -->
  <the-wrapper-dapp
    :has-exit-btn="true"
    :banner-img="bgDappsStake"
    :title-icon="iconColorfulETH"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    top-strip
  >
    <!--
    ===================================================
    The Staked Header/Banner
    ===================================================
    -->
    <template #HeaderBody>
      <v-divider class="textPrimary my-3" />
      <div class="d-flex flex-wrap align-center justify-center">
        <div class="text-uppercase textPrimary--text font-weight-bold">
          Total Staked:
          <span class="primary--text">{{ totalStaked }}</span>
        </div>
        <v-icon color="textPrimary">mdi-circle-medium</v-icon>
        <div class="text-uppercase textPrimary--text font-weight-bold">
          Current APR: <span class="primary--text">{{ currentAPR }}</span>
        </div>
      </div>
      <!--
    ===================================================
    Menu tabs
    ===================================================
    -->
      <v-btn-toggle
        v-model="activeTab"
        class="d-flex align-center justify-center mt-3 white--text"
        mandatory
        borderless
        active-class="active-btn font-weight-medium"
        background-color="transparent"
      >
        <v-btn
          class="px-md-9 white--text text-transform--initial"
          color="#00182c"
        >
          New stake
        </v-btn>
        <v-btn
          class="
            px-md-9
            white--text
            text-transform--initial
            d-flex
            flex-column
            align-center
          "
          color="#00182c"
        >
          <div>
            <div class="white--text">My stake</div>
            <div class="mew-caption tagLabel--text">32.245234 ETH</div>
          </div>
        </v-btn>
      </v-btn-toggle>
    </template>
    <!--
    ===================================================
    Info Link
    ===================================================
    -->
    <template #HeaderRight>
      <div class="text-right">
        <a
          href="https://kb.myetherwallet.com/en/dapps/stake-eth2-web/#:~:text=MEW%20has%20integrated%20Staked.us,least%2032%20ETH%20to%20stake."
          target="_blank"
          class="primary--text font-weight-medium text-right"
        >
          New to staking? Learn more
          <v-icon class="ml-1" small color="primary">mdi-open-in-new</v-icon>
        </a>
      </div>
    </template>

    <!--
    ===================================================
    New Stake Tab
    ===================================================
    -->
    <template #tabContent1>
      <v-sheet
        min-height="500px"
        max-width="700px"
        color="transparent"
        class="mx-auto"
      >
        <staked-stepper
          :current-apr="currentAPR"
          :start-provision="startProvision"
          :polling-status="pollingStatus"
          @readyToStake="sendTransaction"
        />
      </v-sheet>
    </template>
    <!--
    ===================================================
    My Stake tab
    ===================================================
    -->
    <template #tabContent2>
      <v-sheet
        min-height="500px"
        max-width="700px"
        color="transparent"
        class="py-15 mx-auto"
      >
        <staked-status :validators="validators" :loading="loadingValidators" />
      </v-sheet>
    </template>
  </the-wrapper-dapp>
</template>

<script>
import iconColorfulETH from '@/assets/images/icons/icon-colorful-eth.svg';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import handlerStaked from './handlers/handlerStaked';
import bgDappsStake from '@/assets/images/backgrounds/bg-dapps-stake.svg';
import { mapGetters, mapState } from 'vuex';
import StakedStepper from './components/staked-stepper/StakedStepper';
import StakedStatus from './components/StakedStatus';

export default {
  name: 'TheStakedLayout',
  components: {
    TheWrapperDapp,
    StakedStepper,
    StakedStatus
  },
  data() {
    return {
      iconColorfulETH: iconColorfulETH,
      header: {
        title: 'Ethereum 2.0 staking',
        subtext:
          'Stake on Ethereum 2.0 and earn continuous rewards for providing a public good to the community.',
        subtextClass: 'textPrimary--text'
      },
      activeTab: 0,
      handlerStaked: {},
      bgDappsStake: bgDappsStake,
      tabs: [{ name: 'stake' }, { name: 'status' }]
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['network']),
    /**
     * Total Staked
     * @returns string
     */
    totalStaked() {
      return this.handlerStaked.totalStaked + ' ETH';
    },
    /**
     * Current APR
     * @returns string
     */
    currentAPR() {
      return this.handlerStaked.apr;
    },
    /**
     * Gets the status after polling (happens on step4)
     * @returns object
     */
    pollingStatus() {
      return this.handlerStaked.pollingStatus;
    },
    /**
     * Gets the clients validators
     * @returns array
     */
    validators() {
      return this.handlerStaked.myValidators;
    }
  },
  mounted() {
    /**
     * Initiate Stake Handler
     */
    this.handlerStaked = new handlerStaked(
      this.web3,
      this.network,
      this.address
    );
  },
  methods: {
    /**
     * Start provisioning
     */
    startProvision(params) {
      return this.handlerStaked.startProvision(params);
    },
    /**
     * Send transaction to confirm staking
     */
    sendTransaction() {
      this.activeTab = 1;
      this.handlerStaked.sendTransaction();
    }
  }
};
</script>

<style scoped>
.active-btn {
  background-color: #001f74 !important;
}
</style>
