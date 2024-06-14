<template>
  <!--
    ===================================================
    The Staked Layout
    ===================================================
    -->
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    external-contents
    :on-tab="tabChanged"
    :valid-networks="validNetworks"
  >
    <!--
    ===================================================
    The Staked Header/Banner
    ===================================================
    -->
    <template #HeaderBody>
      <v-divider class="textMedium my-3" />
      <div class="d-flex flex-wrap align-center justify-center">
        <div class="text-uppercase textMedium--text font-weight-bold">
          Total Staked:
          <span class="greenPrimary--text">{{ totalStaked }}</span>
        </div>
        <v-icon color="textMedium">mdi-circle-medium</v-icon>
        <div class="text-uppercase textMedium--text font-weight-bold">
          Current APR:
          <span class="greenPrimary--text">{{ currentAprFormatted }}</span>
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
            <div v-if="!loadingValidators" class="mew-caption textLight--text">
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
          :href="getArticle('stake-eth2-mew-web')"
          target="_blank"
          class="greenPrimary--text font-weight-medium text-right"
        >
          New to staking? Learn more
          <v-icon class="ml-1" small color="greenPrimary"
            >mdi-open-in-new</v-icon
          >
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
        <StakedStepper
          ref="stakedStepper"
          :current-apr="stakedHandler.apr"
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
          :tx-receipt="stakedHandler.txReceipt"
          :pending-hash="pendingTxHash"
          :validators="validators"
          :loading="loadingValidators"
          :amount="amount"
          :refetch-validators="refetchValidators"
        />
      </v-sheet>
    </template>
  </the-wrapper-dapp>
</template>

<script setup>
import { ref, defineAsyncComponent, computed, watch, onMounted } from 'vue';
import { SUPPORTED_NETWORKS } from './handlers/supportedNetworks';
import { STAKED_ROUTE } from './configsRoutes';
import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

import handlerStaked from './handlers/handlerStaked';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useRoute } from 'vue-router/composables';
import { useArticleStore } from '@/core/store/article';

const TheWrapperDapp = defineAsyncComponent(() =>
  import('@/dapps/TheWrapperDapp.vue')
);
const StakedStepper = defineAsyncComponent(() =>
  import('./components/staked-stepper/StakedStepper')
);
const StakedStatus = defineAsyncComponent(() =>
  import('./components/StakedStatus')
);

// injections/use
const { trackDapp } = useAmplitude();
const { web3, identifier, address } = useWalletStore();
const { network } = useGlobalStore();
const { getArticle } = useArticleStore();
const route = useRoute();

// data
const validNetworks = SUPPORTED_NETWORKS;
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-stake.svg');
const tabs = [
  {
    name: 'Stake',
    route: { name: STAKED_ROUTE.STAKED.NAME },
    id: 0
  },
  {
    name: 'Status',
    route: {
      name: STAKED_ROUTE.STATUS.NAME,
      path: STAKED_ROUTE.STATUS.PATH
    },
    id: 1
  }
];
const header = {
  title: 'Ethereum 2.0 staking',
  subtext:
    'Stake on Ethereum 2.0 and earn continuous rewards for providing a public good to the community.',
  subtextClass: 'textMedium--text'
};
const amount = ref(0);
const activeTab = ref(0);
const stakedHandler = ref({});
const stakedStepper = ref(null);

// computed
/**
 * Total staked by user
 * @returns string
 */
const myETHTotalStaked = computed(() => {
  return (
    formatFloatingPointValue(stakedHandler.value.myETHTotalStaked).value +
    ' ETH'
  );
});
/**
 * Total Staked
 * @returns string
 */
const totalStaked = computed(() => {
  return (
    formatFloatingPointValue(stakedHandler.value.totalStaked).value + ' ETH'
  );
});
/**
 * Current APR Formatted
 * @returns string
 */
const currentAprFormatted = computed(() => {
  if (stakedHandler.value.apr > 0) {
    return formatPercentageValue(stakedHandler.value.apr).value;
  }
  return '--';
});
/**
 * Gets the status after polling (happens on step4)
 * @returns object
 */
const pollingStatus = computed(() => {
  return stakedHandler.value.pollingStatus;
});
/**
 * Gets the clients validators
 * @returns array
 */
const validators = computed(() => {
  return stakedHandler.value.myValidators;
});
/**
 * Checks if validators are loading
 * @returns boolean
 */
const loadingValidators = computed(() => {
  return stakedHandler.value.loadingValidators;
});
/**
 * Checks for pending tx hash
 * @returns string
 */
const pendingTxHash = computed(() => {
  return stakedHandler.value.pendingTxHash;
});
const isValidNetwork = computed(() => {
  const chainID = network.value.type.chainID;
  const validChain = validNetworks.filter(item => item.chainID === chainID);
  return validChain.length > 0;
});

// watch
watch(
  () => route,
  () => {
    detactUrlChangeTab();
  }
);
/**
 * @watches pendingTxHash (comes after send transaction)
 * if it gets set then go to staked status
 */
watch(
  () => pendingTxHash,
  newVal => {
    if (newVal !== '') {
      activeTab.value = 1;
    }
    if (stakedStepper.value) {
      stakedStepper.value.reset();
    }
  }
);
/*
    - watches for address state change
    - updates handlerStaked with new address
    - if user is currently onStep within the stakeStepper component, it will run the reset function
    */
watch(
  () => address,
  newVal => {
    stakedHandler.value.address = newVal;
    if (stakedStepper.value) {
      stakedStepper.value.reset();
    }
  }
);

// mounted
onMounted(() => {
  /**
   * Check url and change tab on load
   */
  detactUrlChangeTab();

  /**
   * Initiate Stake Handler
   */
  if (isValidNetwork.value) {
    stakedHandler.value = new handlerStaked(
      web3.value,
      network.value,
      address.value,
      trackDapp,
      identifier.value
    );
  }
});

// methods
const detactUrlChangeTab = () => {
  const currentRoute = route.name;
  if (currentRoute === STAKED_ROUTE.STATUS.NAME) {
    activeTab.value = tabs[1].id;
  } else {
    activeTab.value = tabs[0].id;
  }
};
const tabChanged = tab => {
  activeTab.value = tab;
};
/**
 * Start provisioning
 */
const startProvision = params => {
  return stakedHandler.value.startProvision(params);
};
/**
 * Send transaction to confirm staking
 * and set amount value for staked status
 */
const sendTransaction = amountETH => {
  trackDapp('StakedSendStake');
  stakedHandler.value.sendTransaction();
  amount.value = amountETH;
};
/**
 * refetch validators
 */
const refetchValidators = () => {
  stakedHandler.value.getValidators();
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
