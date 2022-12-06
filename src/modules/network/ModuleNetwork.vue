<template>
  <div class="mew-component--side-info-network">
    <mew6-white-sheet :sideinfo="!mobile" class="py-5">
      <div class="px-5 px-lg-7 mew-heading-2 mb-2">
        {{ $t('common.network') }}
      </div>
      <div class="px-3">
        <v-btn
          v-if="show"
          depressed
          color="white"
          class="title-button"
          width="100%"
          height="70px"
          @click.native="openNetworkOverlay"
        >
          <div
            class="d-flex align-center justify-space-between text-transform--none text-decoration--none"
            style="width: 100%"
          >
            <div class="text-left">
              <div class="mew-heading-3 mb-2">{{ fullName }}</div>
              <div class="textMedium--text">Last Block: {{ lastBlock }}</div>
            </div>
            <mew-token-container size="55px" :img="icon"></mew-token-container>
          </div>
        </v-btn>
      </div>
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
    // type() {
    //   return this.network.type.currencyName;
    // },
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
      if (window.ethereum)
        metamask =
          window.ethereum.isMetaMask &&
          !window.ethereum.hasOwnProperty('isMewWallet') &&
          !window.ethereum.hasOwnProperty('isTrust');
      return (
        this.identifier !== WALLET_TYPES.WALLET_CONNECT &&
        (this.identifier !== WALLET_TYPES.WEB3_WALLET || metamask)
      );
    }
  },
  mounted() {
    // this.openNetworkOverlayOnLoad();
  },
  methods: {
    // set to wait for 1 sec until event bus is ready
    // openNetworkOverlayOnLoad() {
    //   setTimeout(() => {
    //     this.$route.name == ROUTES_WALLET.NETWORK.NAME
    //       ? this.openNetworkOverlay()
    //       : '';
    //   }, 1000);
    // },
    openNetworkOverlay() {
      EventBus.$emit('openNetwork');
    }
  }
};
</script>

<style lang="scss">
.mew-component--side-info-network {
  .title-button {
    padding: 8px 16px;

    width: 294px;
    height: 68px;

    border-radius: 8px;
  }
}
</style>
