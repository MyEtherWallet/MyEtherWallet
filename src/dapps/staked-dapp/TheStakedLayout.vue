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
    :hide-default-tab-header="true"
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
          Current APR:
          <span class="primary--text">{{ currentAprFormatted }}</span>
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
        active-class="expandHeader font-weight-bold"
        background-color="transparent"
      >
        <v-btn
          class="px-md-9 white--text text-transform--initial"
          :class="activeTab === 0 ? 'staked-tab-active' : 'staked-tab-inactive'"
          color=""
        >
          New stake
        </v-btn>
        <v-btn
          :class="[
            'px-md-9 white--text text-transform--initial d-flex  flex-column align-center',
            activeTab === 1 ? 'staked-tab-active' : 'staked-tab-inactive'
          ]"
          color=""
        >
          <div>
            <div
              :class="[
                'white--text',
                activeTab === 1 ? 'font-weight-medium' : ''
              ]"
            >
              My stake
            </div>
            <div v-if="!loadingValidators" class="mew-caption tagLabel--text">
              {{ !loadingValidators ? myETHTotalStaked : '--' }}
            </div>
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
          href="https://help.myetherwallet.com/en/articles/5449132-stake-on-eth2-using-mew-web"
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
          ref="stakedStepper"
          :current-apr="handlerStaked.apr"
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
        class="py-13 mx-auto"
      >
        <staked-status
          :tx-receipt="handlerStaked.txReceipt"
          :pending-hash="pendingTxHash"
          :validators="validators"
          :loading="loadingValidators"
          :amount="amount"
        />
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
import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

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
      amount: 0,
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
     * Total staked by user
     * @returns string
     */
    myETHTotalStaked() {
      return (
        formatFloatingPointValue(this.handlerStaked.myETHTotalStaked).value +
        ' ETH'
      );
    },
    /**
     * Total Staked
     * @returns string
     */
    totalStaked() {
      return (
        formatFloatingPointValue(this.handlerStaked.totalStaked).value + ' ETH'
      );
    },
    /**
     * Current APR Formatted
     * @returns string
     */
    currentAprFormatted() {
      if (this.handlerStaked.apr > 0) {
        return formatPercentageValue(this.handlerStaked.apr).value;
      }
      return '--';
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
    },
    /**
     * Checks if validators are loading
     * @returns boolean
     */
    loadingValidators() {
      return this.handlerStaked.loadingValidators;
    },
    /**
     * Checks for pending tx hash
     * @returns string
     */
    pendingTxHash() {
      return this.handlerStaked.pendingTxHash;
    }
  },
  watch: {
    /**
     * @watches pendingTxHash (comes after send transaction)
     * if it gets set then go to staked status
     */
    pendingTxHash(newVal) {
      if (newVal !== '') {
        this.activeTab = 1;
      }
      if (this.$refs.stakedStepper) {
        this.$refs.stakedStepper.reset();
      }
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
     * and set amount value for staked status
     */
    sendTransaction(amountETH) {
      this.handlerStaked.sendTransaction();
      this.amount = amountETH;
    }
  }
};
</script>

<style lang="scss" scoped>
.staked-tab-inactive {
  background-color: rgba(0, 0, 0, 0.24) !important;
}
.staked-tab-active::before {
  opacity: 0 !important;
}
</style>
