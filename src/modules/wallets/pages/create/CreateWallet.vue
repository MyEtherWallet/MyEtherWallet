<template>
  <div class="mew-component--create-wallet expandHeader">
    <block-title :data="titleData">
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
    </block-title>

    <v-container>
      <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <a href="https://www.mewwallet.com/" target="_blank">
          <mew-super-button
            btn-mode="large-right-image"
            class="mb-5"
            color-theme="basic"
            title="Get MEWwallet"
            subtitle="MEW Brings a hardware wallet style security to your iOS or Android
              smartphone, helping you to secure your funds as never before."
            title-mdi-icon="mdi-shield-check"
            title-icon-class="primary--text"
          >
            <template v-slot:contentBelowTitle>
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
            <template v-slot:contentRight>
              <img
                class="mew-wallet-img"
                src="@/assets/images/snippets/bg-mew-wallet.png"
                alt="MEWwallet"
                style="height: 190px"
              />
            </template>
          </mew-super-button>
        </a>

        <a
          href="https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?utm_source=chrome-ntp-icon"
          target="_blank"
        >
          <mew-super-button
            btn-mode="small-right-image"
            class="mb-5"
            color-theme="basic"
            title="MEW CX"
            subtitle="MEWcx is a secure and convinient way to create and manage your
                wallet. Click here to download today."
            title-mdi-icon="mdi-shield-check"
            title-icon-class="primary--text"
            :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
          >
          </mew-super-button>
        </a>

        <mew-super-button
          btn-mode="small-right-image"
          class="mb-5"
          color-theme="outline"
          title="Software"
          subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
          title-mdi-icon="mdi-shield-check"
          title-icon-class="warning--text text--darken-1"
          note="NOT RECOMMANDED"
          @click.native="showSoftware = true"
        />
      </v-sheet>
    </v-container>

    <div class="spacer-y-medium" />
    <toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />

    <software-overlay
      :open="showSoftware"
      @closeOverlay="showSoftware = false"
    />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import SoftwareOverlay from '@/modules/wallets/components/create-wallet-software-overlay/CreateWalletSoftwareOverlay';

export default {
  name: 'CreateNewWallet',
  components: {
    blockTitle,
    'software-overlay': SoftwareOverlay
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
    },
    showSoftware: false
  })
};
</script>

<style lang="scss">
/*
.mew-component--create-wallet {
  .mew-button {
    padding: 5px 30px !important;
    div {
      letter-spacing: 0;
    }
    .title-wrapper {
      margin-bottom: 10px;

      > div:first-child {
        font-size: 22px !important;
        margin-right: 3px;
      }
      .title-icon {
        font-size: 20px !important;
      }
    }
    div:nth-child(2) {
      font-weight: 400 !important;
      line-height: 20px;
    }
  }

  .mew-wallet-btn {
    padding: 5px 30px 70px 30px !important;

    .left-container {
      max-width: 400px !important;
    }

    .mew-wallet-img {
      height: 200px;
      margin-bottom: -99px;
      margin-right: 42px;
    }
    .app-stores {
      position: absolute;
      top: 150px;
      left: 10px;
      img {
        height: 35px;
        margin-right: 10px;
      }
    }
  }
  .mew-cx-btn {
    .right-icon {
      height: 100px !important;
      max-height: 100px !important;
    }
  }
}
*/
</style>
