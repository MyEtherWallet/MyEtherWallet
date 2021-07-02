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
          :pending-hash="handlerStaked.pendingTxHash"
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
import { toWei } from 'web3-utils';

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
    // this.web3.eth.sendTransaction({
    //   data: '0xca0bfcce0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030a76e36232e23c05ad91fa7cd5c1aed977f158dc15a03293183ca342f29f89bc5c224a79a7ec62c11bee0b489e3c266df00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020002d93685fed8b7f2346df40251ec7ef8c2e29e93a679b1f7749cbc2428874b400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006084dbed52600df0efbb1dffdef542e712dc769f8ca2cc2e3a8878d1d816500e3b0afa5bb18539790b8b66bf1fecf9964111bcd4bffd069c2a20357bf040c0c26cc4942e6a8813e328016b713274a7f467e4ddeeb99aea22c5129407f6016e49000000000000000000000000000000000000000000000000000000000000000001f08f9c07e685c75e20384514f9554dcfaf5bca9dc23e7fbbe9905a4fb84276d9',
    //   from: '0xe5dc07bdcdb8c98850050c7f67de7e164b1ea391',
    //   to: '0xc2a689783af563e79f87cbfa3a6b14e6e2e42b21',
    //   value: '0x1c040a6de051e0000'
    // });
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
      this.amount = amountETH;
      this.activeTab = 1;
      this.handlerStaked.sendTransaction();
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
