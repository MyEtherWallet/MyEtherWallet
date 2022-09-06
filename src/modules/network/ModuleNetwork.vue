<template>
  <div class="mew-component--side-info-network">
    <mew6-white-sheet
      :sideinfo="!mobile"
      class="px-5 px-lg-7 py-5 d-flex justify-space-between"
    >
      <div>
        <div class="d-flex align-center">
          <span class="mew-heading-2 mr-2">{{ $t('common.network') }}</span>
          <v-btn
            v-if="show"
            depressed
            color="greyLight"
            class="title-button"
            @click.native="openNetworkOverlay"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <div class="mt-4">
          <div class="mb-1">{{ type }} - {{ fullName }}</div>
          <div>Last Block: {{ lastBlock }}</div>
        </div>
      </div>
      <mew-token-container size="65px" :img="icon"></mew-token-container>
    </mew6-white-sheet>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import WALLET_TYPES from '../access-wallet/common/walletTypes';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import { EventBus } from '@/core/plugins/eventBus';
export default {
  name: 'ModuleNetwork',
  beforeRouteLeave(to, from, next) {
    if (to.name == ROUTES_HOME.ACCESS_WALLET.NAME) {
      next({ name: ROUTES_WALLET.DASHBOARD.NAME });
    } else {
      next();
    }
  },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('wallet', ['blockNumber', 'identifier', 'isHardware']),
    ...mapState('global', ['validNetwork']),
    ...mapGetters('global', ['network']),
    type() {
      return this.network.type.currencyName;
    },
    fullName() {
      return this.network.type.name_long;
    },
    lastBlock() {
      return formatIntegerToString(this.blockNumber);
    },
    icon() {
      return this.network.type.icon;
    },
    show() {
      let metamask = false;
      if (window.ethereum) metamask = window.ethereum.isMetaMask;
      return this.identifier !== WALLET_TYPES.WEB3_WALLET || metamask;
    }
  },
  mounted() {
    this.$route.name == ROUTES_WALLET.NETWORK.NAME
      ? this.openNetworkOverlay()
      : '';
  },
  methods: {
    openNetworkOverlay() {
      this.$router.push({ name: ROUTES_WALLET.NETWORK.NAME });
      EventBus.$emit('openNetwork');
    }
  }
};
</script>

<style lang="scss">
.mew-component--side-info-network {
  .title-button {
    height: 28px !important;
    min-width: 28px !important;
    padding: 0 !important;
    border-radius: 5px;
  }
}
</style>
