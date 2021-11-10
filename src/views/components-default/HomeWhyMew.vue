<template>
  <div class="mew-component--why-mew">
    <div class="desktop-content d-none d-lg-block">
      <div class="py-6" />
      <v-container>
        <v-sheet color="transparent" max-width="400px">
          <div class="mew-heading-3 text-uppercase textLight--text mb-1">
            Why MEW
          </div>
          <h1 class="mb-9">
            Easy and secure access to the Ethereum Blockchain
          </h1>
        </v-sheet>

        <div class="d-flex">
          <mew-info-card
            class="d-flex align-end block-box-shadow"
            title="Friendly to use"
            desc="Access the Ethereum blockchain's original and most-trusted wallet, now with a host of new features all contained in an elegant and friendly interface."
            :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
          />
          <div class="pa-4"></div>

          <div class="d-flex flex-column">
            <mew-info-card
              class="full-height"
              max-width="600"
              title="Swaps, DeFi, DApps, NFTs, Stablecoins"
              desc="Partnered with Bity, Kyber Network, Changelly, and Simplex to allow users to swap fiat to crypto, ETH and BTC, ETH and ERC-20."
            />
            <div class="pa-4"></div>
            <mew-info-card
              class="full-height"
              max-width="600"
              title="Hardware wallet support"
              desc="MEW offers support for all major hardware wallets including Ledger, Trezor, and many more."
            />
          </div>

          <div class="pa-4"></div>
          <mew-info-card
            title="MEW wallet"
            desc="MEW brings a hardware wallet style security to your iOS or Android smart phone, helping you to secure your funds as never before."
            :link="{
              title: 'Get the App',
              url: 'https://www.mewwallet.com/'
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
      <div class="py-12" />
    </div>
    <div class="mobile-content d-block d-lg-none">
      <div class="py-7" />
      <v-container>
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <v-sheet color="transparent" max-width="400px" class="mb-9">
            <h5 class="font-weight-bold text-uppercase textLight--text mb-2">
              Why Mew
            </h5>
            <h1>Make Ethereum Blockchain easy and secure</h1>
          </v-sheet>

          <mew-info-card
            class="d-flex align-end block-box-shadow mx-auto mb-6"
            title="Friendly to use"
            desc="Access the Ethereum blockchains original and most-trusted wallet client, now with a host of new features all contained in an elegant, easy and friendly interface."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
            :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
          />

          <mew-info-card
            class="full-height mx-auto mb-6"
            title="Swaps, DeFi, DApps, NFTs, Stablecoins"
            desc="Partnered with Bity, Kyber Network, Changelly, and Simplex to allow users to swap fiat to crypto, ETH and BTC, ETH and ERC-20."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />

          <mew-info-card
            class="full-height mx-auto mb-6"
            title="Hardware wallet support"
            desc="MEW offers support for all major hardware wallets including Ledger, Trezor, and many more."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />

          <mew-info-card
            class="mx-auto"
            title="MEW wallet"
            desc="MEW brings a hardware wallet style security to your iOS or Android smart phone, helping you to secure your funds as never before."
            :link="{
              title: 'Get the App',
              url: 'www.myetherwallet.com'
            }"
          >
            <template #titleIconContainer>
              <div class="ml-2">
                <img
                  src="@/assets/images/icons/icon-appstore-apple-dark.svg"
                  alt="Apple app store"
                  class="mr-1"
                />
                <img
                  src="@/assets/images/icons/icon-appstore-android-dark.svg"
                  alt="Android store"
                />
              </div>
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
        </v-sheet>
      </v-container>
      <div class="py-7" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeWhyMew',
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.desktop-content {
  .card-img {
    margin-bottom: -5px;
  }
  .info-card {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid var(--v-greyMedium-base) !important;
  }
}

.mobile-content {
  .card-img {
    margin-bottom: -5px;
  }
  .info-card {
    max-width: initial !important;
    width: 100%;
    margin-bottom: 1rem;
  }
  .info-card {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid var(--v-greyMedium-base) !important;
  }
}
</style>

<style lang="scss">
.mew-component--why-mew {
  .v-card__title {
    word-break: initial !important;
    line-height: 1.5rem !important;
  }
}
</style>
