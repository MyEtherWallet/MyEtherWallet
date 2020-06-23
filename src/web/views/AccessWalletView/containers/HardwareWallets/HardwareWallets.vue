<template>
  <div class="bg_blue">
    <v-sheet color="transparent" max-width="450px" class="mx-auto">
      <BlockTitle :data="titleData">
        <h5 class="white--text ma-0">
          Select a hardware to access your wallet. Make sure your device is
          connected and unlocked.
        </h5>
      </BlockTitle>
    </v-sheet>
    <v-sheet color="transparent" max-width="850px" class="mx-auto px-5">
      <v-row>
        <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="6">
          <HardwareWalletBtn
            :data="btn"
            @click.native="openOverlay(btn.overlayName)"
          />
        </v-col>
      </v-row>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import HardwareWalletBtn from './components/HardwareWalletBtn';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle, HardwareWalletBtn },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Hardware Wallets',
        description: '',
        centered: true
      },
      buttons: [
        {
          label: 'Ledger',
          icon: require('@/assets/images/icons/hardware-wallets/icon-ledger.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'Bitbox',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          overlayName: 'accessWalletLedger'
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          overlayName: 'accessWalletLedger'
        }
      ]
    };
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>

<style lang="scss" scoped>
.new-wallet-button {
  &:hover {
    box-shadow: 0 0 50px var(--v-police_strobe-base);
  }
}
</style>
