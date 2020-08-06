<template>
  <div class="expandHeader">
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
          :to="{ name: 'AccessWalletBrowserExtension', query: {} }"
          class="display--block"
        >
          <mew-super-button
            color-theme="basic"
            title="Browser Extension"
            subtitle="Use Browser Extension to access my wallet"
            icon-type="img"
            :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
            title-icon="mdi-shield-check"
          />
        </router-link>
      </div>
      <div class="mb-5">
        <router-link
          :to="{ name: 'AccessWalletHardwareWallets', query: {} }"
          class="display--block"
        >
          <mew-super-button
            color-theme="basic"
            title="Hardware wallets"
            subtitle="Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot"
            right-icon-type="img"
            title-icon-type="mdi"
            :right-icon="
              require('@/assets/images/icons/icon-hardware-wallet.png')
            "
            title-icon="mdi-shield-check"
          />
        </router-link>
      </div>
      <div class="mb-5">
        <router-link
          :to="{ name: 'AccessWalletMobileApps', query: {} }"
          class="display--block"
        >
          <mew-super-button
            color-theme="basic"
            title="Mobile Apps"
            subtitle="WalletConnect, Wallet Link"
            icon-type="img"
            :right-icon="
              require('@/assets/images/icons/icon-wallet-connect.svg')
            "
            :right-icon2="require('@/assets/images/icons/icon-wallet-link.png')"
            title-icon="mdi-shield-check"
          />
        </router-link>
      </div>
      <div>
        <router-link
          :to="{ name: 'HomeCreateWalletSoftware', query: {} }"
          class="display--block"
        >
          <mew-super-button
            color-theme="outline"
            title="Software"
            subtitle="Keystore files, Mnemonic phrase, Private key"
            icon-type="img"
            title-icon="mdi-alert"
            note="NOT RECOMMANDED"
          />
        </router-link>
      </div>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  name: 'CreateNewWallet',
  components: {
    blockTitle
  },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Access My Wallet',
      description: '',
      centered: true
    }
  }),
  methods: {}
};
</script>
