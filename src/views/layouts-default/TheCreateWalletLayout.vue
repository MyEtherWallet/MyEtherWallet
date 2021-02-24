<template>
  <div class="mew-component--create-wallet expandHeader">
    <!--
    =====================================================================================
        Layout Title
    =====================================================================================
    -->
    <app-block-title :data="titleData">
      <h5 class="white--text ma-0">
        Please select a method to create a new wallet.
      </h5>
      <h5 class="white--text ma-0">
        Already have a wallet?
        <router-link
          :to="{ name: 'AccessWallet', query: {} }"
          class="text-decoration--underline"
        >
          Access my wallet
        </router-link>
      </h5>
    </app-block-title>
    <!--
    =====================================================================================
        Options
    =====================================================================================
    -->
    <v-container>
      <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <!--
        =====================================================================================
          MEW wallet Button
        =====================================================================================
        -->
        <a href="https://www.mewwallet.com/" target="_blank">
          <mew-super-button
            font-class="mew-heading-2"
            class="mb-5"
            color-theme="basic"
            title="Get MEW wallet App"
            subtitle="Download our official app and connect to MEW web using your mobile phone. Available on iOS and Android."
            title-icon="mdi-shield-check"
            title-icon-type="mdi"
            title-icon-class="primary--text"
          >
            <!-- need to add this slot -->
            <template #contentBelowTitle>
              <div class="mt-6">
                <img
                  src="@/assets/images/icons/button-app-store.png"
                  alt="Apple app store"
                  style="height: 30px"
                  class="mr-2"
                />
                <img
                  src="@/assets/images/icons/button-play-store.png"
                  alt="Google play store"
                  style="height: 30px"
                />
              </div>
            </template>
            <template #contentSlot>
              <img
                class="mew-wallet-img"
                src="@/assets/images/snippets/bg-mew-wallet.png"
                alt="MEWwallet"
                style="height: 140px; margin-top: 20px"
              />
            </template>
          </mew-super-button>
        </a>
        <!--
        =====================================================================================
          Buy Hardware Button
        =====================================================================================
        -->
        <mew-super-button
          font-class="mew-heading-2"
          class="mb-5"
          color-theme="basic"
          title="Buy a Hardware Wallet"
          subtitle="A hardware wallet offers the highest security for accessing your crypto"
          title-icon="mdi-shield-check"
          title-icon-type="mdi"
          title-icon-class="primary--text"
          right-icon-type="img"
          :right-icon="
            require('@/assets/images/icons/icon-hardware-wallet.png')
          "
          @click.native="$router.push({ name: 'BuyHardwareWallet' })"
        />
        <!--
        =====================================================================================
          Create Software Button
        =====================================================================================
        -->
        <mew-super-button
          font-class="mew-heading-2"
          class="mb-5"
          color-theme="outline"
          title="Software"
          subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
          title-icon-class="warning--text text--darken-1"
          title-icon="mdi-alert"
          title-icon-type="mdi"
          note="NOT RECOMMENDED"
          @click.native="openSoftwareModule"
        />
      </v-sheet>
    </v-container>
    <div class="spacer-y-medium" />
    <mew-toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />
    <!--
    =====================================================================================
      Create Wallet with Software Overlay - activates on Create Software Button click
    =====================================================================================
    -->
    <module-create-wallet-software
      :open="showSoftwareModule"
      :wallet-type="type"
      :close="closeSoftwareModule"
    />
  </div>
</template>

<script>
import ModuleCreateWalletSoftware from '@/modules/create-wallet/ModuleCreateWalletSoftware';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import AppBlockTitle from '@/core/components/AppBlockTitle';

export default {
  name: 'TheCreateWalletLayout',
  components: {
    AppBlockTitle,
    ModuleCreateWalletSoftware
  },
  props: {
    showSoftwareModule: {
      type: Boolean
    },
    type: {
      type: String,
      default: 'overview'
    }
  },
  data: () => ({
    toastLink: {
      title: 'Buy a hardware wallet',
      url: ''
    },
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Create a new wallet',
      description: '',
      centered: true
    }
  }),
  methods: {
    openSoftwareModule() {
      try {
        this.$router.push({
          name: 'CreateWallet',
          params: { overlay: 'software' },
          query: { type: 'overview' }
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    closeSoftwareModule() {
      try {
        this.$router.push({
          name: 'CreateWallet'
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss"></style>
