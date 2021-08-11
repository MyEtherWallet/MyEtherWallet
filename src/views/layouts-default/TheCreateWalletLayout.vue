<template>
  <div class="expandHeader">
    <v-container>
      <!--
    =====================================================================================
        Layout Title
    =====================================================================================
    -->
      <the-layout-header
        title="Create a new wallet"
        subtitle-line-one="Please select a method to create a new wallet"
        subtitle-line-two="Already have a wallet?"
        :route-obj="titleRoute"
        has-link
      />
      <!--
    =====================================================================================
        Options
    =====================================================================================
    -->
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
            title="Get MEW wallet app"
            subtitle="Download our official app and connect to MEW web using your mobile phone. Available on iOS and Android."
            title-icon="mdi-shield-check"
            title-icon-type="mdi"
            title-icon-class="primary--text"
          >
            <!-- need to add this slot -->
            <template #contentBelowTitle>
              <div class="mt-6">
                <img
                  src="@/assets/images/icons/button-app-store.svg"
                  alt="Apple app store"
                  style="height: 30px"
                  class="mr-2"
                />
                <img
                  src="@/assets/images/icons/button-play-store.svg"
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
          subtitle="For the highest standard of security, buy a hardware wallet and use it with MEW."
          title-icon="mdi-shield-check"
          title-icon-type="mdi"
          title-icon-class="primary--text"
          right-icon-type="img"
          :right-icon="
            require('@/assets/images/icons/icon-hardware-wallet.png')
          "
          @click.native="
            $router.push({ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME })
          "
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
          subtitle="Software methods like keystore file and mnemonic phrase should only be used in offline settings by experienced users."
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
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'TheCreateWalletLayout',
  components: {
    ModuleCreateWalletSoftware,
    TheLayoutHeader
  },
  mixins: [handlerAnalytics],
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
    titleRoute: {
      text: 'Access Wallet',
      routeName: 'AccessWallet'
    },
    ROUTES_HOME: ROUTES_HOME
  }),
  mounted() {
    this.setTracking('createWallet', 'landed');
  },
  methods: {
    openSoftwareModule() {
      try {
        this.$router.push({
          name: ROUTES_HOME.CREATE_WALLET.NAME,
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
          name: ROUTES_HOME.CREATE_WALLET.NAME
        });
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss"></style>
