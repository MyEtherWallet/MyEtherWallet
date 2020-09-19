<template>
  <div class="expandHeader">
    <v-container>
      <block-title :data="titleData">
        <h5 class="white--text ma-0">
          Please select a method to access your wallet.
        </h5>
        <h5 class="white--text ma-0">
          Don't have a wallet?
          <router-link
            :to="{ name: 'HomeCreateWallet', query: {} }"
            class="text-color--mew-green"
          >
            Get a new wallet
          </router-link>
        </h5>
      </block-title>
      <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <div class="mb-5">
          <router-link
            :to="{ name: 'AccessWalletHardwareWallets', query: {} }"
            class="display--block"
          >
            <mew-super-button
              btn-mode="small-right-image"
              color-theme="basic"
              title="MEWconnect"
              subtitle="Use MEWconnect to access my wallet"
              title-mdi-icon="mdi-shield-check"
              title-icon-class="primary--text"
              :right-icon="
                require('@/assets/images/icons/icon-mew-connect.png')
              "
            />
          </router-link>
        </div>
        <div class="mb-5">
          <router-link
            :to="{ name: 'AccessWalletHardwareWallets', query: {} }"
            class="display--block"
          >
            <mew-super-button
              btn-mode="small-right-image"
              color-theme="basic"
              title="Hardware wallets"
              subtitle="Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot"
              title-mdi-icon="mdi-shield-check"
              title-icon-class="primary--text"
              :right-icon="
                require('@/assets/images/icons/icon-hardware-wallet.png')
              "
            />
          </router-link>
        </div>
        <div class="mb-5">
          <router-link
            :to="{ name: 'AccessWalletMobileApps', query: {} }"
            class="display--block"
          >
            <mew-super-button
              btn-mode="small-right-image"
              color-theme="basic"
              title="Mobile Apps"
              subtitle="WalletConnect, Wallet Link"
              title-mdi-icon="mdi-shield-check"
              title-icon-class="primary--text"
              :right-icons="[
                require('@/assets/images/icons/icon-wallet-connect.svg'),
                require('@/assets/images/icons/icon-wallet-link.png')
              ]"
            />
          </router-link>
        </div>
        <div class="mb-5">
          <router-link
            :to="{ name: 'AccessWalletBrowserExtension', query: {} }"
            class="display--block"
          >
            <mew-super-button
              btn-mode="small-right-image"
              color-theme="basic"
              title="Browser Extension"
              subtitle="Use Browser Extension to access my wallet"
              title-mdi-icon="mdi-shield-check"
              title-icon-class="primary--text"
              :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
            />
          </router-link>
        </div>
        <div>
          <mew-super-button
            btn-mode="small-right-image"
            color-theme="outline"
            title="Software"
            subtitle="Keystore files, Mnemonic phrase, Private key"
            title-mdi-icon="mdi-alert"
            title-icon-class="warning--text text--darken-1"
            note="NOT RECOMMANDED"
            @click.native="showSoftware = true"
          />
        </div>
      </v-sheet>
      <div class="spacer-y-medium" />
    </v-container>
    <software-overlay
      :open="showSoftware"
      @closeOverlay="showSoftware = false"
    />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import SoftwareOverlay from '@/modules/wallets/components/access-wallet-software-overlay/AccessWalletSoftwareOverlay';

export default {
  name: 'CreateNewWallet',
  components: {
    blockTitle,
    'software-overlay': SoftwareOverlay
  },
  data: () => ({
    showSoftware: false,
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Access My Wallet',
      description: '',
      centered: true
    }
  })
};
</script>
