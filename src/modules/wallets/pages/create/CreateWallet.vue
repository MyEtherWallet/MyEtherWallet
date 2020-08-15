<template>
  <div class="mew-component--create-wallet expandHeader">
    <block-title :data="titleData">
      <h5 class="white--text ma-0">
        Please select a method to create a new wallet.
      </h5>
      <h5 class="white--text ma-0">
        Already have a wallet?
        <router-link
          :to="{ name: 'HomeAccessWallet', query: {} }"
          class="text-decoration--underline"
        >
          Access my wallet
        </router-link>
      </h5>
    </block-title>

    <v-sheet color="transparent" max-width="650px" class="mx-auto">
      <mew-super-button
        class="mew-wallet-btn mb-5"
        color-theme="basic"
        title="Get MEWwallet"
        subtitle="MEW Brings a hardware wallet style security to your iOS or Android
              smartphone, helping you to secure your funds as never before."
        title-icon="mdi-shield-check"
        title-icon-type="mdi"
        right-icon-type="img"
        title-icon-class="primary--text"
        btn-link="https://www.mewwallet.com/"
      >
        <template v-slot:contentSlot>
          <img
            class="mew-wallet-img"
            :src="require('@/assets/images/snippets/bg-mew-wallet.png')"
          />
          <div class="app-stores">
            <img
              src="@/assets/images/icons/button-app-store.png"
              alt="Apple app store"
            />
            <img
              src="@/assets/images/icons/button-play-store.png"
              alt="Google play store"
            />
          </div>
        </template>
      </mew-super-button>

      <mew-super-button
        class="mew-cx-btn mb-5"
        color-theme="basic"
        title="MEW CX"
        subtitle="MEWcx is a secure and convinient way to create and manage your
                wallet. Click here to download today."
        title-icon="mdi-shield-check"
        title-icon-type="mdi"
        right-icon-type="img"
        title-icon-class="primary--text"
        :right-icon="require('@/assets/images/icons/icon-mew-cx.png')"
        btn-link="https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en"
      >
      </mew-super-button>

      <mew-super-button
        class="mb-5"
        color-theme="outline"
        title="Software"
        subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
        title-icon="mdi-alert"
        title-icon-class="warning--text text--darken-1"
        note="NOT RECOMMANDED"
        title-icon-type="mdi"
        @click.native="showSoftware = !showSoftware"
      />
    </v-sheet>

    <div class="spacer-y-medium" />
    <toast
      ref="toast"
      can-close
      :link-obj="toastLink"
      text="Did you know? Hardware wallets offer the highest security for accessing your crypto."
      toast-type="info"
    />

    <software-overlay :open="showSoftware" />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import SoftwareOverlay from '@/modules/wallets/components/software-overlay/SoftwareOverlay';

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
      title: 'Get a New Wallet',
      description: '',
      centered: true
    },
    showSoftware: false
  }),
  watch: {
    showSoftware(newVal) {
      console.log(newVal);
    }
  },
  mounted() {
    //this.$refs.toast.showToast();
  }
};
</script>

<style lang="scss">
.mew-component--create-wallet {
  .mew-button {
    padding: 5px 30px !important;
    .title-wrapper {
      margin-bottom: 10px;
      > div:first-child {
        font-size: 22px !important;
        letter-spacing: -0.4px;
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
</style>
