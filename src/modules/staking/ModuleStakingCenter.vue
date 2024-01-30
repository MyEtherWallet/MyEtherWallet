<template>
  <!-- ===================================================================================== -->
  <!-- Dapp Center Module -->
  <!-- ===================================================================================== -->
  <v-sheet color="#F8F8F8">
    <div class="staking-banner">
      <img
        src="@/assets/images/backgrounds/staking-banner.png"
        alt="staking banner"
        width="100%"
      />
      <div class="staking-banner-copy">
        <div class="mew-title white--text override-title">Ethereum Staking</div>
        <div class="mew-title font-weight-regular white--text override-title">
          Make your crypto make crypto
        </div>
        <div
          class="mew-heading-4 font-weight-regular faded pt-0 pt-md-4 d-none d-md-block"
        >
          Stake your ETH and get rewarded by Ethereum <br />
          blockchain.
        </div>
        <a
          href="https://www.mewtopia.com/staking-the-easiest-way-to-earn-rewards/"
          target="_blank"
          class="white--text font-weight-bold pt-0 pt-md-2"
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
            class="pa-6 staking-item border-radius--5px elevation-2"
          >
            <v-col cols="10">
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
            <v-col cols="2">
              <img :src="dapp.icon" width="64px" height="64px" />
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

<script>
import { mapGetters } from 'vuex';

import stakedInfo from '@/dapps/staked-dapp/metainfo.js';
import coinbaseInfo from '@/dapps/coinbase-staking/metainfo.js';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import isNew from '@/core/helpers/isNew.js';
import { STAKED_ROUTE } from '@/dapps/staked-dapp/configsRoutes';
import { COINBASE_STAKING_ROUTES } from '@/dapps/coinbase-staking/configs';

export default {
  mixins: [handlerAnalytics],
  data() {
    return {};
  },
  computed: {
    ...mapGetters('global', ['network']),
    dapps() {
      return [
        {
          title: 'Staked',
          apr: '---',
          description: 'Stake full validators with 32 ETH or more',
          icon: require('@/assets/images/icons/dapps/icon-dapp-stake.svg'),
          routeName: STAKED_ROUTE.STAKED.NAME,
          release: stakedInfo.release
        },
        {
          title: 'ETH Staking Powered by Coinbase',
          apr: 'Up to 4% APR',
          description: 'Stake any amount of ETH and earn rewards',
          icon: require('@/assets/images/icons/dapps/icon-dapp-coinbase.png'),
          routeName: COINBASE_STAKING_ROUTES.CORE.NAME,
          release: coinbaseInfo.release
        }
      ];
    }
  },
  methods: {
    routeTo(name) {
      this.trackStaking(name);
      this.$router.push({ name: name });
    },
    /**
     * defualtName is used to route to dapps that has defalt child route
     */
    checkIfNew(release) {
      return isNew(release);
    }
  }
};
</script>

<style lang="scss">
.warning-container {
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #05c0a5;
  color: #05c0a5;
  background-color: #ebfaf8;
}

.staking-banner {
  position: relative;
}
.staking-banner-copy {
  position: absolute;
  top: 15px;
  left: 20px;
}

.override-title {
  font-size: calc(12px + 1.75vw) !important;
  line-height: calc(12px + 1.95vw) !important;
}

.faded {
  color: rgba(255, 255, 255, 0.7);
}

.staking-item {
  background-color: #ffffff;
}
</style>
