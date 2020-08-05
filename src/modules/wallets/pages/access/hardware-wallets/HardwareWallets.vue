<template>
  <div class="expandHeader">
    <BlockTitle :data="titleData">
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
    </BlockTitle>

    <v-sheet color="transparent" max-width="850px" class="mx-auto px-5">
      <v-row>
        <v-col
          v-for="(btn, key) in buttons"
          :key="key"
          class="btn-container"
          cols="12"
          sm="6"
        >
          <mew-super-button
            font-class="mew-heading-2"
            :title="btn.label"
            @click.native="openOverlay(btn.overlayName)"
          >
            <template v-slot:contentSlot>
              <img :src="btn.icon" :alt="btn.label" />
            </template>
          </mew-super-button>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/components/block-title';

export default {
  name: 'CreateNewWallet',
  components: { BlockTitle },
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

<style lang="scss" scoped>
.btn-container {
  max-height: 100px;
}
</style>
