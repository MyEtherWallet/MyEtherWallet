/* eslint-disable */
<template>
  <div class="component--wallet-card">
    <div class="mew-card drop-shadow">
      <img
        :src="'https://mewcard.mewapi.io/?address=' + address"
        alt="MEW Card"
        @load="animateMewCard()"
      />
    </div>

    <module-access-wallet-hardware
      v-if="!!instance.path"
      :open="openChangeAddress"
      :close="closeChangeAddress"
      :switch-address="!!instance.path"
    />
    <balance-address-paper-wallet
      :open="openPaperWallet"
      :close="closePaperWallet"
      @close="closePaperWallet"
    />
    <app-modal
      :show="openQR"
      :close="closeQR"
      :has-buttons="false"
      width="408px"
    >
      <template #dialogBody>
        <app-addr-qr />
      </template>
    </app-modal>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';
import AppModal from '@/core/components/AppModal';
import AppAddrQr from '@/core/components/AppAddrQr';
import ModuleAccessWalletHardware from '@/modules/access-wallet/ModuleAccessWalletHardware';
import BalanceAddressPaperWallet from './components/BalanceAddressPaperWallet';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  components: {
    BalanceAddressPaperWallet,
    AppModal,
    AppAddrQr,
    ModuleAccessWalletHardware
  },
  data() {
    return {
      openChangeAddress: false,
      openPaperWallet: false,
      openQR: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    ...mapState('wallet', ['address', 'instance', 'identifier']),
    ...mapGetters('external', [
      'fiatValue',
      'balanceFiatValue',
      'totalTokenFiatValue'
    ]),
    ...mapGetters('global', ['isEthNetwork', 'network', 'isTestNetwork'])
  },
  methods: {
    ...mapActions('external', ['setTokenAndEthBalance']),
    animateMewCard() {
      const el = document.querySelector('.mew-card');
      if (el) {
        el.style.opacity = 0;
        anime({
          targets: el,
          opacity: 1,
          delay: 1300,
          duration: 500,
          easing: 'easeInOutQuad'
        });
      }
    },
    closeChangeAddress() {
      this.openChangeAddress = false;
    },
    closePaperWallet() {
      this.openPaperWallet = false;
    },
    closeQR() {
      this.openQR = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.component--wallet-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: relative;
  width: 100%;
}
.mew-card {
  border-radius: 16px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  height: 100%;
  img {
    height: 100%;
    width: 100%;
  }
}

.v-btn::before {
  background-color: transparent;
}
.info-container {
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  width: 100%;
  position: relative;
  min-height: 172px;
  top: 0;
  left: 0;
  z-index: 1;
  .info-container--addr {
    font-size: 10px;
    line-height: 10px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }
  .info-container--addr:hover {
    color: white;
  }
  .info-container--text {
    font-size: 12px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.9);
  }
  .info-container--text-chain-balance {
    font-size: 14px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.9);
  }

  .info-container--action-btn {
    opacity: 0.6;
    border-radius: 10px !important;
    height: 32px !important;
    width: 32px !important;
    font-size: 16px !important;
  }

  .info-container--action-print {
    opacity: 0.6;
    border-radius: 4px !important;
    height: 14px !important;
    width: 14px !important;
    font-size: 8px !important;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.24),
      0px 1px 4px 0px rgba(0, 0, 0, 0.24);
  }

  .info-container--action-btn:hover,
  .info-container--action-print:hover {
    opacity: 1;
  }
  .info-container--icon:hover {
    color: var(--v-primary-base) !important;
  }
}

.text-shadow {
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24), 0px 1px 4px rgba(0, 0, 0, 0.24);
}

.drop-shadow {
  filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.24)),
    drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.24));
}

.refresh-icon:hover {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  color: var(--v-white-base) !important;
  height: 20px;
  width: 20px;
}

.refresh-icon.v-icon.v-icon::after {
  background-color: transparent;
}
</style>
