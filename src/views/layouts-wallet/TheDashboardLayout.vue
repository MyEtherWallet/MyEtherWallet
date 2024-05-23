<template>
  <the-wrapper-wallet
    :total-left-col-items="showBanner || hasStaked ? 3 : 2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <div>
        <module-balance />
      </div>
    </template>
    <template v-if="showBanner" #leftColItem2>
      <div>
        <dashboard-banner />
      </div>
    </template>
    <template v-if="hasStaked" #leftColItem2>
      <div>
        <staking-summary-card
          :eth-price="ethPrice"
          :staked-rewards="stakedRewards"
          :cb-stake-rewards="cbStakeRewards"
          :apr="currentApr"
        />
      </div>
    </template>
    <template #[hasBanner]>
      <module-tokens />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
      <module-swap-rates />
    </template>
    <template #[name]>
      <wallet-carousel />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { isArray } from 'lodash';

import { fromBase } from '@/core/helpers/unit';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { ETH, HOLESKY, GOERLI } from '@/utils/networks/types';
import handlerStaked from '@/dapps/staked-dapp/handlers/handlerStaked.js';

const STAKED_ENDPOINT = 'https://staked.mewapi.io';
const COINBASE_ENDPOINT = 'https://coinbase-staking.mewapi.io/staking';

export default {
  components: {
    WalletCarousel: () =>
      import('@/views/components-wallet/WalletCarousel.vue'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    DashboardBanner: () => import('@/views/components-wallet/DashboardBanner'),
    StakingSummaryCard: () =>
      import('@/views/components-wallet/StakingSummaryCard')
  },
  data() {
    return {
      cbStakeRewards: {
        totalRewards: 0,
        totalStaked: 0
      },
      stakedRewards: {
        totalRewards: 0,
        totalStaked: 0
      },
      stakedLoading: true,
      cbStakeLoading: true,
      handlerStaked: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3', 'identifier']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    ...mapGetters('external', ['getCoinGeckoTokenById']),
    stakingSupported() {
      return [GOERLI, HOLESKY, ETH];
    },
    showBanner() {
      const supportedIdx = this.stakingSupported.findIndex(item => {
        if (item.chainID === this.network.type.chainID) return item;
      });
      return supportedIdx > -1 && !this.hasStaked;
    },
    hasStaked() {
      return (
        !this.loading &&
        (BigNumber(this.cbStakeRewards.totalStaked).gt(0) ||
          BigNumber(this.stakedRewards.totalStaked).gt(0))
      );
    },
    hasBanner() {
      return `leftColItem${this.showBanner || this.hasStaked ? 3 : 2}`;
    },
    name() {
      return !this.isEthNetwork ? 'rightColItem1' : 'rightColItem2';
    },
    loading() {
      return this.stakedLoading || this.cbStakeLoading;
    },
    ethPrice() {
      const { price } = this.getCoinGeckoTokenById('ethereum');
      return price;
    },
    currentApr() {
      return this.handlerStaked.apr;
    }
  },
  mounted() {
    if (this.network.type.chainID === ETH.chainID) {
      this.getStakedRewards();
      this.getCbStakeRewards();
      this.handlerStaked = new handlerStaked(
        this.web3,
        this.network,
        this.address,
        () => {},
        this.identifier
      );
    }
  },
  methods: {
    async getStakedRewards() {
      try {
        const response = await fetch(
          `${STAKED_ENDPOINT}/history?address=${this.address}`
        );
        const data = await response.json();
        if (!isArray(data)) {
          this.stakedLoading = false;
          return;
        }
        this.stakedRewards = data.reduce(
          (initVal, currentValue) => {
            const newValue = Object.assign({}, initVal);
            const { raw } = currentValue;
            let rewards = 0;
            let staked = 0;
            raw.forEach(rItm => {
              if (rItm.status === 'ACTIVE') {
                rewards += BigNumber(
                  rItm.detailed_balance_info.reward
                ).toNumber();
                staked += BigNumber(rItm.amount).toNumber();
              }
            });
            newValue.totalStaked += staked;
            newValue.totalRewards += BigNumber(
              fromBase(rewards, 18)
            ).toNumber();
            return newValue;
          },
          { totalStaked: 0, totalRewards: 0 }
        );
        this.stakedLoading = false;
      } catch (error) {
        this.stakedLoading = false;
        Toast(error, {}, ERROR);
      }
    },
    async getCbStakeRewards() {
      try {
        const response = await fetch(
          `${COINBASE_ENDPOINT}?address=${this.address}&action=details&networkId=${this.network.type.chainID}`
        );
        const data = await response.json();
        const { integratorShareBalance, integratorShareUnderlyingBalance } =
          data;
        this.cbStakeRewards = {
          totalStaked: BigNumber(
            fromBase(integratorShareUnderlyingBalance.value, 18)
          ).toNumber(),
          totalRewards: BigNumber(
            fromBase(integratorShareBalance.value, 18)
          ).toNumber()
        };
        this.cbStakeLoading = false;
      } catch (error) {
        this.cbStakeLoading = false;
        Toast(error, {}, ERROR);
      }
    }
  }
};
</script>
