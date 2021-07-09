<template>
  <div class="mew-component--landing">
    <div class="desktop-content d-none d-lg-block expandHeader">
      <v-container
        class="
          banner-content-container
          d-flex
          align-center
          justify-space-between
        "
      >
        <v-card color="transparent" flat tile max-width="430px">
          <div class="white--text mew-title">Ethereum's Original Wallet</div>
          <p class="white--text mt-3">
            MEW (MyEtherWallet) is a free, client-side interface helping you
            interact with the Ethereum blockchain. Our easy-to-use, open-source
            platform allows you to generate wallets, interact with smart
            contracts, and so much more.
          </p>
          <div class="mt-9 d-flex">
            <mew-button
              class="mr-3"
              :has-full-width="false"
              title="Create a new wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.CREATE_WALLET.NAME,
                  params: {}
                })
              "
            />
            <mew-button
              :has-full-width="false"
              btn-style="outline"
              title="Access my wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.ACCESS_WALLET.NAME,
                  params: {}
                })
              "
            />
          </div>
        </v-card>
        <img
          src="@/assets/images/backgrounds/bg-home-spaceman-and-dog.svg"
          alt="Spaceman and his dog"
          height="500"
        />
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none expandHeader pt-5">
      <v-container>
        <v-card color="transparent" flat tile max-width="400px" class="mx-auto">
          <div
            class="white--text font-weight-bold mb-4"
            style="font-size: 3rem; line-height: 3.3rem"
          >
            Ethereum's Original Wallet
          </div>
          <p class="white--text mt-3">
            MEW (MyEtherWallet) is a free, client-side interface helping you
            interact with the Ethereum blockchain. Our easy-to-use, open-source
            platform allows you to generate wallets, interact with smart
            contracts, and so much more.
          </p>
          <div class="mt-12">
            <mew-button
              class="mb-3 width--full"
              :has-full-width="false"
              title="Create a new wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.CREATE_WALLET.NAME,
                  params: {}
                })
              "
            />
            <mew-button
              class="width--full"
              :has-full-width="false"
              btn-style="outline"
              title="Access my wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.ACCESS_WALLET.NAME,
                  params: {}
                })
              "
            />
          </div>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/router/config-routes';

export default {
  name: 'HomeLanding',
  components: {},
  data() {
    return { ROUTES_HOME: ROUTES_HOME };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.desktop-content {
  background-image: url(~@/assets/images/backgrounds/bg-homepage.svg);
  background-size: cover;
  background-position: 100% bottom;
  .banner-content-container {
    height: 800px;
  }
}

.mobile-content {
  background-image: url('~@/assets/images/backgrounds/bg-homepage-spaceman-center.svg');
  background-position: bottom center;
  background-size: 88rem;
  padding: 0 0 30rem 0;
}
</style>
