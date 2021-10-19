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
        <router-link
          :to="{ name: ROUTE_DAPP_CENTER.NAME }"
          class="bluePrimary--text"
        >
          <v-row class="align-center" no-gutters>
            <v-icon class="bluePrimary--text" size="20">
              mdi-chevron-left</v-icon
            >
            <div>{{ $t('common.dapps') }}</div>
          </v-row>
        </router-link>
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
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
export default {
  name: 'TheDappHeader',
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
    }
  },
  data: () => ({
    ROUTE_DAPP_CENTER: ROUTES_WALLET.DAPPS
  })
};
</script>

<style lang="scss" scoped>
.dapp-icon {
  background-color: white;
  border: 1px solid #d7dae3;
  border-radius: 12px;
  width: 88px;
  height: 88px;
}
</style>
