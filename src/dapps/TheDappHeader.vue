<template>
  <v-container fluid class="pa-5 pt-sm-9 px-sm-13">
    <!--
    =====================================================================================
      DAPP HEADER:
      ---------
      |       |     Link to DApp Center
      | ICON  |     Dapp Name
      |       |     Dapp text
      ---------
    =====================================================================================
    -->
    <v-row clas="align-center justify-center" no-gutters>
      <!--
      ===================================
       DApp Icon
      ====================================
      -->
      <div class="dapp-icon">
        <v-img
          v-if="dappImg !== ''"
          :src="dappImg"
          width="88"
          height="88"
          contain
        />
      </div>
      <v-col class="pl-5 pl-sm-8">
        <!--
        ===================================
          Link to Dapp Center
        ====================================
        -->
        <div class="router-link">
          <router-link
            :to="{ name: ROUTE_DAPP_CENTER.NAME }"
            class="blue500--text"
          >
            <v-row class="align-center" no-gutters>
              <v-icon class="blue500--text" size="20"> mdi-chevron-left</v-icon>
              <div>{{ $t('common.dapps') }}</div>
            </v-row>
          </router-link>
        </div>
        <!--
        ===================================
          Link to Dapp Name
        ====================================
        -->
        <div class="mew-heading-1 py-2">{{ dappName }}</div>
        <!--
        ===================================
         Dapp Subtext
        ====================================
        -->
        <p class="textMedium--text mb-0">
          {{ dappText }}
          <span v-if="dappLink !== ''">
            <a
              target="_blank"
              class="greenPrimary--text"
              :href="dappLink"
              @click="trackDappClick"
              >{{ $t('common.learn-more') }}</a
            >{{
          }}</span>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAnalyticsMixin from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
export default {
  name: 'TheDappHeader',
  mixins: [handlerAnalyticsMixin],
  props: {
    dappName: {
      type: String,
      default: 'Sample Dapp Name'
    },
    dappText: {
      type: String,
      default: 'Sample Dapp Text'
    },
    dappImg: {
      type: String,
      default: ''
    },
    dappLink: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    ROUTE_DAPP_CENTER: ROUTES_WALLET.DAPPS
  }),
  methods: {
    trackDappClick() {
      const path = this.$route.path;
      let name;
      if (path.includes('eth-blocks')) {
        name = 'EthBlocks';
      } else if (path.includes('coinbase')) {
        name = 'Coinbase';
      } else if (path.includes('staked')) {
        name = 'Staked';
      } else if (path.includes('stakewise')) {
        name = 'Stakewise';
      } else if (path.includes('ens')) {
        name = 'ENSManager';
      }
      this.trackDapp(`${name}HelpLink`);
    }
  }
};
</script>

<style lang="scss" scoped>
.dapp-icon {
  border-radius: 12px;
  width: 88px;
  height: 88px;
}

.router-link {
  display: inline-block;
}
</style>
