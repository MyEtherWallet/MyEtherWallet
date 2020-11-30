<template>
  <div class="mew-component--get-started">
    <div class="desktop-content d-none d-lg-block">
      <v-container>
        <div class="d-flex align-center px-6">
          <div>
            <h2 class="font-weight--700 white--text mb-3">
              Ready? Create my wallet today.
            </h2>
            <p class="white--text ma-0">
              Still don't know what MEW is?
              <a
                class="color--inherit font-weight-medium text-decoration--underline"
                href="https://kb.myetherwallet.com/"
                target="_blank"
              >
                Learn more
              </a>
            </p>
          </div>
          <v-spacer />
          <router-link :to="{ name: 'CreateWallet', query: {} }">
            <mew-button
              title="Get a new wallet"
              color-theme="white"
              button-size="xlarge"
              icon="newWallet"
              icon-align="left"
              icon-type="mew"
            />
          </router-link>
        </div>
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none">
      <v-container>
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div class="mb-9">
            <h1 class="font-weight--700 white--text">
              Ready? Create my wallet today.
            </h1>
            <p class="white--text mt-3">
              Still don't know what MEW is?
              <a
                class="color--inherit font-weight-medium text-decoration--underline"
                href="https://kb.myetherwallet.com/"
                target="_blank"
              >
                Learn more
              </a>
            </p>
          </div>
          <mew-button
            btn-link="/create-wallet"
            title="Get a new wallet"
            color-theme="white"
            button-size="xlarge"
            icon="newWallet"
            icon-align="left"
            icon-type="mew"
          />
        </v-sheet>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetStarted',
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.mew-component--get-started {
  background: linear-gradient(90deg, #24a2ca 0%, #32bfa5 100%);
}
.desktop-content {
  padding: 80px 0;
}
.mobile-content {
  padding: 4rem 0;
}
</style>

<style lang="scss">
.mew-component--get-started {
  .desktop-content {
    .v-btn {
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
      height: 70px !important;
      .icon img {
        height: 50px;
        margin-right: 5px;
      }
    }
  }
  .mobile-content {
    .v-btn {
      padding: 0 2.5rem !important;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
      height: 70px !important;
      .icon img {
        height: 50px;
        margin-right: 5px;
      }
    }
  }
}
</style>
