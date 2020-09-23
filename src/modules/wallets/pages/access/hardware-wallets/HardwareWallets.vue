<template>
  <div class="expandHeader">
    <v-container>
      <block-title :data="titleData">
        <h5 class="white--text ma-0">
          Select a hardware to access your wallet. Make sure your device is
          connected and unlocked.
          <span
            class="primary--text cursor--pointer"
            @click="$router.push({ name: 'BuyHardwareWallet', params: {} })"
          >
            Buy hardware wallet
          </span>
        </h5>
      </block-title>

      <v-sheet color="transparent" max-width="750px" class="mx-auto">
        <v-row>
          <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="6">
            <mew-super-button
              btn-mode="small-right-image"
              color-theme="basic"
              :title="btn.label"
              :right-icon="btn.icon"
              :right-icon-class="15"
              :right-icon-height="45"
              @click.native="openOverlay(btn.overlayName)"
            />
          </v-col>
        </v-row>
      </v-sheet>
      <div class="spacer-y-medium" />
    </v-container>
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: { blockTitle },
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
          overlayName: 'accessWalletBitbox'
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          overlayName: 'accessWalletFinney'
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          overlayName: 'accessWalletSecalot'
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          overlayName: 'accessWalletKeepKey'
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          overlayName: 'accessWalletTrezor'
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          overlayName: 'accessWalletCoolWallet'
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          overlayName: 'accessWalletBCVault'
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          overlayName: 'accessWalletXWallet'
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
