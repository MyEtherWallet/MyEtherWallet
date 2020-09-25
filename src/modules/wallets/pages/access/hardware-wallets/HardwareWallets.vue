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
              :right-icon-height="45"
              @click.native="overlayName = btn.overlayName"
            />
          </v-col>
        </v-row>
      </v-sheet>
      <div class="spacer-y-medium" />
    </v-container>
    <access-wallet-overlay :open="overlayName" @reset="overlayName = ''" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import accessWalletOverlay from '@/modules/wallets/components/access-wallet-overlay/AccessWalletOverlay';

export default {
  name: 'CreateNewWallet',
  components: { blockTitle, accessWalletOverlay },
  data() {
    return {
      overlayName: '',
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
          overlayName: 'ledger'
        },
        {
          label: 'Bitbox',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg'),
          overlayName: 'bitbox'
        },
        {
          label: 'FINNEY',
          icon: require('@/assets/images/icons/hardware-wallets/icon-finney.svg'),
          overlayName: 'finney'
        },
        {
          label: 'Secalot',
          icon: require('@/assets/images/icons/hardware-wallets/icon-secalot.svg'),
          overlayName: 'secalot'
        },
        {
          label: 'KeepKey',
          icon: require('@/assets/images/icons/hardware-wallets/icon-keepkey.svg'),
          overlayName: 'keepkey'
        },
        {
          label: 'Trezor',
          icon: require('@/assets/images/icons/hardware-wallets/icon-trezor.svg'),
          overlayName: 'trezor'
        },
        {
          label: 'CoolWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-coolwallet.svg'),
          overlayName: 'coolwallet'
        },
        {
          label: 'BC Vault',
          icon: require('@/assets/images/icons/hardware-wallets/icon-bcvault.svg'),
          overlayName: 'bcvault'
        },
        {
          label: 'XWallet',
          icon: require('@/assets/images/icons/hardware-wallets/icon-xwallet.svg'),
          overlayName: 'xwallet'
        }
      ]
    };
  }
};
</script>
