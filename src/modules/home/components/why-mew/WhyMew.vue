<template>
  <!-- need to translate -->
  <v-container class="mew-component--why-mew">
    <v-sheet color="transparent" max-width="400px">
      <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
        Why Mew
      </div>
      <h2 class="mew-subtitle mb-9">
        Make Ethereum Blockchain easy and secure
      </h2>
    </v-sheet>

    <div class="d-flex">
      <mew-info-card
        class="d-flex align-end block-box-shadow"
        title="Friendly to use"
        desc="Access the Ethereum blockchains original and most-trusted wallet client, now with a host of new features all contained in an elegant, easy and friendly interface."
        :link="{
          title: 'Learn more',
          url: 'www.myetherwallet.com'
        }"
        :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
      />
      <div class="pa-4"></div>

      <div class="d-flex flex-column">
        <mew-info-card
          class="full-height"
          max-width="600"
          title="Swap easily"
          desc="Partnered with Bity, Kyber Network, Changelly, and Simplex to allow users to swap fiat to crypto, ETH and BTC, ETH and ERC-20."
          :link="{
            title: 'Learn more',
            url: 'www.myetherwallet.com'
          }"
        />
        <div class="pa-4"></div>
        <mew-info-card
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

      <div class="pa-4"></div>
      <mew-info-card
        title="MEWwallet"
        desc="MEW brings a hardware wallet style security to your iOS or Android smart phone, helping you to secure your funds as never before."
        :link="{
          title: 'Get the App',
          url: 'www.myetherwallet.com'
        }"
      >
        <template #titleIconContainer>
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
        <template #cardImg>
          <img
            class="card-img"
            width="200"
            src="@/assets/images/snippets/bg-mew-wallet.png"
            alt="MEW wallet"
          />
        </template>
      </mew-info-card>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'HomeWhyMew',
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.card-img {
  margin-bottom: -7px;
}
</style>
