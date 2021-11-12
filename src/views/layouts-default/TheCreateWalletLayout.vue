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
      <div style="max-width: 650px" class="mx-auto">
        <a href="https://www.mewwallet.com/" target="_blank">
          <mew-button class="mb-5" color-theme="white" style="height: 160px">
            <div class="px-2 textDark--text text-left d-flex align-center">
              <div>
                <div class="mb-2 d-flex align-center">
                  <div class="mew-heading-2">Get MEW wallet app</div>
                  <v-icon dense color="greenPrimary" class="ml-1">
                    mdi-shield-check
                  </v-icon>
                </div>
                <div class="break-word">
                  Download our official app and connect to MEW web using your
                  mobile phone. Available on iOS and Android.
                </div>
              </div>
              <div class="d-none d-sm-block pl-5">
                <img
                  class="mew-wallet-img"
                  src="@/assets/images/snippets/bg-mew-wallet.png"
                  alt="MEWwallet"
                  style="height: 140px; margin-top: 20px; margin-bottom: -3px"
                />
              </div>
            </div>
          </mew-button>
        </a>

        <mew-button
          class="mb-5"
          color-theme="white"
          style="height: 160px"
          @click.native="
            $router.push({ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME })
          "
        >
          <div class="px-2 textDark--text text-left d-flex align-center">
            <div>
              <div class="mb-2 d-flex align-center">
                <div class="mew-heading-2">Get MEW wallet app</div>
                <v-icon dense color="greenPrimary" class="ml-1">
                  mdi-shield-check
                </v-icon>
              </div>
              <div class="break-word">
                Download our official app and connect to MEW web using your
                mobile phone. Available on iOS and Android.
              </div>
            </div>
            <div class="d-none d-sm-block px-5">
              <img
                class="mew-wallet-img"
                src="@/assets/images/icons/icon-hardware-wallet.png"
                alt="MEWwallet"
                style="height: 90px"
              />
            </div>
          </div>
        </mew-button>

        <div class="position--relative">
          <div
            class="orangePrimary--text mew-label"
            style="position: absolute; top: 15px; right: 25px"
          >
            NOT RECOMMENDED
          </div>
          <mew-button
            class="mb-5"
            color-theme="white"
            btn-style="outline"
            style="height: 160px; position: relative"
            @click.native="openSoftwareModule"
          >
            <div class="px-2 textDark--text text-left">
              <div class="mb-2 d-flex align-center">
                <div class="mew-heading-2 white--text">Software</div>
                <v-icon dense color="orangePrimary" class="ml-1">
                  mdi-alert
                </v-icon>
              </div>
              <div class="break-word white--text">
                Download our official app and connect to MEW web using your
                mobile phone. Available on iOS and Android.
              </div>
            </div>
          </mew-button>
        </div>
      </div>
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

export default {
  name: 'TheCreateWalletLayout',
  components: {
    ModuleCreateWalletSoftware,
    TheLayoutHeader
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
    titleRoute: {
      text: 'Access Wallet',
      routeName: 'AccessWallet'
    },
    ROUTES_HOME: ROUTES_HOME
  }),
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
