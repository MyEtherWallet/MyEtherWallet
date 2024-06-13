<template>
  <!-- ===================================================================================== -->
  <!-- Dapp Center Module -->
  <!-- ===================================================================================== -->
  <v-sheet
    color="bgWalletBlock-base"
    class="mew-component--white-sheet border-radius--15px"
  >
    <div class="staking-banner">
      <img
        src="@/assets/images/backgrounds/staking-banner.png"
        alt="staking banner"
        width="100%"
      />
      <div
        class="staking-banner-copy py-2 py-md-10 py-sm-4 px-2 px-md-8 px-sm-4"
      >
        <div class="mew-title white--text override-title">Ethereum Staking</div>
        <div class="mew-title font-weight-regular white--text override-title">
          Make your crypto make crypto
        </div>
        <div
          class="mew-heading-4 font-weight-regular faded pt-0 pt-md-4 d-none d-sm-block"
        >
          Stake your ETH and get rewarded by Ethereum blockchain.
        </div>
        <a class="white--text font-weight-bold" @click="trackMoreAbout"
          >More about staking ></a
        >
      </div>
    </div>
    <div class="pt-4 px-3 pa-md-8">
      <div class="mew-heading-1 px-4 mb-4">Select staking option</div>
      <v-row
        class="pb-12"
        align-content="space-between"
        justify="space-between"
        dense
      >
        <v-col
          v-for="(dapp, key) in dapps"
          :key="key"
          cols="12"
          lg="6"
          md="6"
          class="pa-1"
        >
          <v-row
            no-gutters
            class="pa-3 pa-sm-6 staking-item border-radius--5px elevation-2"
          >
            <v-col
              cols="3"
              sm="2"
              :class="$vuetify.breakpoint.smAndUp ? '' : 'align-content-center'"
            >
              <img
                :src="dapp.icon"
                width="64px"
                height="64px"
                :class="[
                  $vuetify.breakpoint.smAndUp ? 'border-radius--15px' : ''
                ]"
              />
            </v-col>
            <v-col cols="9" sm="10">
              <div class="mew-body font-weight-bold">
                {{ dapp.title }}
                <v-icon
                  v-if="checkIfNew(dapp.release)"
                  size="24"
                  class="ml-1 redPrimary--text"
                >
                  mdi-new-box
                </v-icon>
              </div>
              <div class="mew-body greenPrimary--text">{{ dapp.apr }}</div>
              <div class="mew-label">
                {{ dapp.description }}
              </div>
            </v-col>
            <v-col cols="12" class="text-center pt-3">
              <mew-button
                title="Start Staking"
                btn-size="xsmall"
                @click.native="routeTo(dapp.routeName)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="!dapps.length">
        <v-col cols="12" class="swap-not-available">
          <mew-alert
            theme="warning"
            hide-close-icon
            title="Staking is not supported on this network"
            description="Please select a different network."
          />
        </v-col>
      </v-row>
    </div>
  </v-sheet>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import { formatPercentageValue } from '@/core/helpers/numberFormatHelper';
import stakedInfo from '@/dapps/staked-dapp/metainfo.js';
import coinbaseInfo from '@/dapps/coinbase-staking/metainfo.js';
import isNew from '@/core/helpers/isNew.js';
import { STAKED_ROUTE } from '@/dapps/staked-dapp/configsRoutes';
import { COINBASE_STAKING_ROUTES } from '@/dapps/coinbase-staking/configs';
import { STAKING } from '../analytics-opt-in/handlers/configs/events';
import handlerStaked from '@/dapps/staked-dapp/handlers/handlerStaked.js';
import { ETH, GOERLI, HOLESKY } from '@/utils/networks/types';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import { useRouter } from 'vue-router/composables';

// injections/use
const { trackDapp, trackStaking } = useAmplitude();
const { network } = useGlobalStore();
const { web3, address, identifier } = useWalletStore();
const router = useRouter();

// data
const stakedHandler = ref({});

// computed
const dapps = computed(() => {
  const staking = [];
  if (
    network.value.type.name === ETH.name ||
    network.value.type.name === GOERLI.name
  ) {
    staking.push({
      title: 'Staked',
      apr: currentAprFormatted,
      description: 'Stake full validators with 32 ETH or more',
      icon: require('@/assets/images/icons/dapps/icon-dapp-stake.svg'),
      routeName: STAKED_ROUTE.STAKED.NAME,
      release: stakedInfo.release
    });
  }

  if (
    network.value.type.name === ETH.name ||
    network.value.type.name === HOLESKY.name
  ) {
    staking.push({
      title: 'ETH Staking Powered by Coinbase',
      apr: 'Up to 4% APR',
      description: 'Stake any amount of ETH and earn rewards',
      icon: require('@/assets/images/icons/dapps/icon-dapp-coinbase.svg'),
      routeName: COINBASE_STAKING_ROUTES.CORE.NAME,
      release: coinbaseInfo.release
    });
  }

  return staking;
});

const currentAprFormatted = computed(() => {
  if (stakedHandler.value.apr > 0) {
    return `${formatPercentageValue(stakedHandler.value.apr).value} APR`;
  }
  return '---';
});

// mounted
onMounted(() => {
  if (
    network.value.type.name === ETH.name ||
    network.value.type.name === GOERLI.name
  ) {
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
const routeTo = name => {
  trackStaking(`Page${name}`);
  router.push({ name: name });
};
const trackMoreAbout = () => {
  // eslint-disable-next-line
  window.open(
    'https://www.myetherwallet.com/blog/staking-the-easiest-way-to-earn-rewards/',
    '_blank'
  );
  this.trackStaking(STAKING.STAKE_CENTER_MORE_ABOUT);
};
/**
 * defaultName is used to route to dapps that has defalt child route
 */
const checkIfNew = release => {
  return isNew(release);
};
</script>

<style lang="scss" scoped>
.staking-banner {
  position: relative;
}
.staking-banner-copy {
  position: absolute;
  top: 0;
}

.override-title {
  font-size: calc(12px + 1.75vw) !important;
  line-height: calc(12px + 1.95vw) !important;
}

.faded {
  color: rgba(255, 255, 255, 0.7);
}

.staking-item {
  background-color: var(--v-offWhite-base) !important;
}
</style>

<style lang="scss">
.warning-container {
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #05c0a5;
  color: #05c0a5;
  background-color: #ebfaf8;
}
</style>
