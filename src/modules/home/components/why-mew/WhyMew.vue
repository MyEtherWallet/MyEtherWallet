<template>
  <div class="mew-component--why-mew">
    <div class="desktop-content d-none d-lg-block">
      <div class="py-12" />
      <div class="py-6" />

      <v-container>
        <v-sheet color="transparent" max-width="400px">
          <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
            Why Mew
          </div>
          <h2 class="font-weight--700 mb-9">
            Make Ethereum Blockchain easy and secure
          </h2>
        </v-sheet>

        <div class="d-flex">
          <info-card
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
            <div class="pa-4"></div>
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

          <div class="pa-4"></div>
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
      <div class="py-12" />
    </div>
    <div class="mobile-content d-block d-lg-none">
      <div class="py-7" />
      <v-container>
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <v-sheet color="transparent" max-width="500px" class="mb-9">
            <h5 class="font-weight-bold text-uppercase textPrimary--text mb-2">
              Why Mew
            </h5>
            <h1 class="font-weight--700">
              Make Ethereum Blockchain easy and secure
            </h1>
          </v-sheet>

          <info-card
            class="d-flex align-end block-box-shadow"
            title="Friendly to use"
            desc="Access the Ethereum blockchains original and most-trusted wallet client, now with a host of new features all contained in an elegant, easy and friendly interface."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
            :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
          />

          <info-card
            class="full-height"
            title="Swap easily"
            desc="Partnered with Bity, Kyber Network, Changelly, and Simplex to allow users to swap fiat to crypto, ETH and BTC, ETH and ERC-20."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />

          <info-card
            class="full-height"
            title="Hardware wallets support"
            desc="MEW offers support for all major hardware wallets including Ledger, Trezor, and many more."
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />

          <info-card
            title="MEWwallet"
            desc="MEW brings a hardware wallet style security to your iOS or Android smart phone, helping you to secure your funds as never before."
            :link="{
              title: 'Get the App',
              url: 'www.myetherwallet.com'
            }"
          >
            <template v-slot:titleIconContainer>
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
            <template v-slot:cardImg>
              <img
                class="card-img"
                width="200"
                src="@/assets/images/snippets/bg-mew-wallet.png"
                alt="MEW wallet"
              />
            </template>
          </info-card>
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
    border: 1px solid var(--v-primaryOutlineActive-base) !important;
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
    border: 1px solid var(--v-primaryOutlineActive-base) !important;
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
