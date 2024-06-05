<template>
  <the-wrapper-wallet
    :total-left-col-items="showBanner || hasStaked ? 3 : 2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <div>
        <ModuleBalance />
      </div>
    </template>
    <template #leftColItem2>
      <div>
        <dashboard-banner v-if="showBanner" />
        <staking-summary-card
          v-if="hasStaked"
          :eth-price="ethPrice"
          :staked-rewards="stakedRewards"
          :cb-stake-rewards="cbStakeRewards"
          :apr="currentApr"
        />
      </div>
    </template>
    <template #[hasBanner]>
      <ModuleTokens />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
      <ModuleSwapRates />
    </template>
    <template #[name]>
      <WalletCarousel />
    </template>
  </the-wrapper-wallet>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { isArray } from 'lodash';
import BigNumber from 'bignumber.js';

import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';
import { useWalletStore } from '@/core/store/wallet';
import { ETH, HOLESKY, GOERLI } from '@/utils/networks/types';

import handlerStaked from '@/dapps/staked-dapp/handlers/handlerStaked.js';

const STAKED_ENDPOINT = 'https://staked.mewapi.io';
const COINBASE_ENDPOINT = 'https://coinbase-staking.mewapi.io/staking';

import WalletCarousel from '@/views/components-wallet/WalletCarousel.vue';
import ModuleBalance from '@/modules/balance/ModuleBalance';
import ModuleTokens from '@/modules/balance/ModuleTokens';
import ModuleSwapRates from '@/modules/swap/ModuleSwapRates';
import TheWrapperWallet from '@/views/components-wallet/TheWrapperWallet';
import DashboardBanner from '@/views/components-wallet/DashboardBanner.vue';
import StakingSummaryCard from '@/views/components-wallet/StakingSummaryCard.vue';
import { fromBase } from '@/core/helpers/unit';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

// injections/use
const { isEthNetwork, network } = useGlobalStore();
const { getCoinGeckoTokenById } = useExternalStore();
const { address, web3, identifier } = useWalletStore();
const stakingSupported = [GOERLI, HOLESKY, ETH];

// data
let cbStakeRewards = {
  totalRewards: 0,
  totalStaked: 0
};
let stakedRewards = {
  totalRewards: 0,
  totalStaked: 0
};
let stakedLoading = true;
let cbStakeLoading = true;
let stakedHandler = {};

// computed
const showBanner = computed(() => {
  const supportedIdx = stakingSupported.findIndex(item => {
    if (item.chainID === network.type.chainID) return item;
  });
  return supportedIdx > -1;
});

const hasBanner = computed(() => {
  return `leftColItem${showBanner.value ? 3 : 2}`;
});

const name = computed(() => {
  return isEthNetwork ? 'rightColItem1' : 'rightColItem2';
});

const hasStaked = computed(() => {
  return (
    !loading.value &&
    network.type.chainID === ETH.chainID &&
    (BigNumber(cbStakeRewards.totalStaked).gt(0) ||
      BigNumber(stakedRewards.totalStaked).gt(0))
  );
});
const loading = computed(() => {
  return stakedLoading || cbStakeLoading;
});
const ethPrice = computed(() => {
  const { price } = getCoinGeckoTokenById('ethereum');
  return price;
});
const currentApr = computed(() => {
  return stakedHandler.apr;
});

onMounted(() => {
  if (network.type.chainID === ETH.chainID) {
    getStakedRewards();
    getCbStakeRewards();
    stakedHandler = new handlerStaked(
      web3,
      network,
      address,
      () => {},
      identifier
    );
  }
});

// methods
const getStakedRewards = async () => {
  try {
    const response = await fetch(
      `${STAKED_ENDPOINT}/history?address=${address}`
    );
    const data = await response.json();
    if (!isArray(data)) {
      stakedLoading = false;
      return;
    }
    stakedRewards = data.reduce(
      (initVal, currentValue) => {
        const newValue = Object.assign({}, initVal);
        const { raw } = currentValue;
        let rewards = 0;
        let staked = 0;
        raw.forEach(rItm => {
          if (rItm.status === 'ACTIVE') {
            rewards += BigNumber(rItm.detailed_balance_info.reward).toNumber();
            staked += BigNumber(rItm.amount).toNumber();
          }
        });
        newValue.totalStaked += staked;
        newValue.totalRewards += BigNumber(fromBase(rewards, 18)).toNumber();
        return newValue;
      },
      { totalStaked: 0, totalRewards: 0 }
    );
    stakedLoading = false;
  } catch (error) {
    stakedLoading = false;
    Toast(error, {}, ERROR);
  }
};
const getCbStakeRewards = async () => {
  try {
    const response = await fetch(
      `${COINBASE_ENDPOINT}?address=${address}&action=details&networkId=${network.type.chainID}`
    );
    const data = await response.json();
    const { integratorShareBalance, integratorShareUnderlyingBalance } = data;
    cbStakeRewards = {
      totalStaked: BigNumber(
        fromBase(integratorShareUnderlyingBalance.value, 18)
      ).toNumber(),
      totalRewards: BigNumber(
        fromBase(integratorShareBalance.value, 18)
      ).toNumber()
    };
    cbStakeLoading = false;
  } catch (error) {
    cbStakeLoading = false;
    Toast(error, {}, ERROR);
  }
};
</script>
