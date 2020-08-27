<template>
  <mew-overlay
    :show-overlay="open"
    title="1. Connect with BCVault"
    right-btn-text="Cancel"
  >
    <div class="expandHeader">
      <block-title :data="titleData">
        <h5 class="white--text ma-0">
          Select a app that you want to use to connect MEW.
        </h5>
      </block-title>
      <v-sheet color="transparent" max-width="450px" class="mx-auto px-5">
        <v-row>
          <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
            <router-link :to="btn.to" class="display--block">
              <mew-super-button
                :title="btn.label"
                :subtitle="btn.description"
                :right-icon="btn.icon"
                icon-type="img"
              />
            </router-link>
          </v-col>
        </v-row>
      </v-sheet>
      <div class="spacer-y-medium" />
    </div>
  </mew-overlay>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: { blockTitle },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      titleData: {
        textProps: 'white--text',
        toptitle: '',
        title: 'Mobile apps',
        description: '',
        centered: true
      },
      buttons: [
        {
          label: 'WalletConnet',
          description: 'Connect wallet with Walletconnet',
          icon: require('@/assets/images/icons/icon-wallet-connect.svg'),
          to: { name: 'AccessWalletBrowserExtensionInstall' }
        },
        {
          label: 'Wallet Link',
          description: 'Connect wallet with Wallet Link ',
          icon: require('@/assets/images/icons/icon-wallet-link.png'),
          to: { name: 'AccessWalletBrowserExtensionInstall' }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
