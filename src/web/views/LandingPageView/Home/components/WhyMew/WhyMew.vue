<template>
  <div>
    <!-- need to translate -->
    <v-container>
      <div class="flex-column d-flex">
        <span class="mew-heading-3 text-uppercase textPrimary--text pb-3">
          Why Mew
        </span>
        <span class="mew-subtitle pb-7">
          Make Ethereum Blockchain easy and secure
        </span>
      </div>

      <div class="d-flex">
        <info-card
          title="Friendly user interface"
          desc="Access the Ethereum blockchains original and most-trusted wallet client, now with a host of new features all contained in an elegant, easy and friendly interface."
          :link="{
            title: 'Learn more',
            url: 'www.myetherwallet.com'
          }"
          :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
        />
        <Spacer />

        <div class="d-flex flex-column">
          <info-card
            class="full-height"
            max-width="600"
            title="Swap easily"
            desc="Partnered with Bity, Kyber Network, Changelly, and Simplex to allow users to swap fiat to crypto, ETH and BTC, ETH and ERC-20."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />
          <Spacer />
          <info-card
            class="full-height"
            max-width="600"
            title="Hardware wallets support"
            desc="MEW offers support for all major hardware wallets including Ledger, Trezor, and many more."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />
        </div>

        <Spacer />
        <info-card
          title="MEWwallet"
          desc="MEW brings a hardware wallet style security to your iOS or Android smart phone, helping you to secure your funds as never before."
          :link="{
            title: 'Get the App',
            url: 'www.myetherwallet.com'
          }"
        >
          <template v-slot:titleIconContainer>
            <img
              src="@/assets/images/icons/icon-appstore-apple-dark.svg"
              alt="Apple app store"
              class="ml-2 mr-1"
            />
            <img
              src="@/assets/images/icons/icon-appstore-android-dark.svg"
              alt="Android store"
            />
          </template>
          <template v-slot:cardImg>
            <img
              class="card-img"
              width="200"
              src="@/assets/images/snippets/bg-mew-wallet.png"
              alt="MEW wallet"
            />
          </template>
        </info-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import Spacer from '@/web/components/Common/Spacer';

export default {
  name: 'HomeWhyMew',
  components: {
    Spacer
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.card-img {
  margin-bottom: -7px;
}
</style>
