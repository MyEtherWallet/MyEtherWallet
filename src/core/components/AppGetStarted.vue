<template>
  <div class="mew-component--app-get-started">
    <!-- Desktop design -->
    <div class="desktop-content d-none d-lg-block">
      <v-container>
        <div class="d-flex align-center px-6">
          <div>
            <h2 class="white--text mb-3">Ready to explore Ethereum?</h2>
            <p class="white--text ma-0">
              Still don't know what MEW is?
              <a
                class="color--inherit font-weight-medium text-decoration--underline"
                href="https://kb.myetherwallet.com/en/getting-started/myetherwallet-an-introduction/"
                target="_blank"
              >
                Learn more
              </a>
            </p>
          </div>

          <v-spacer />

          <div class="d-flex">
            <mew-button
              color-theme="primary"
              btn-style="background"
              class="mr-4"
              title="Create a new wallet"
              btn-size="xlarge"
              @click.native="$router.push({ name: 'CreateWallet' })"
            />
            <mew-button
              color-theme="primary"
              btn-style="outline"
              title="Access my wallet"
              btn-size="xlarge"
              @click.native="$router.push({ name: 'AccessWallet' })"
            />
          </div>
        </div>
      </v-container>
    </div>

    <!-- Mobile design -->
    <div class="mobile-content d-block d-lg-none">
      <v-container class="px-5">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div class="mb-9">
            <h1 class="white--text">Ready to explore Ethereum?</h1>
            <p class="white--text mt-3">
              Still don't know what MEW is?
              <a
                class="color--inherit font-weight-medium text-decoration--underline"
                href="https://kb.myetherwallet.com/en/getting-started/myetherwallet-an-introduction/"
                target="_blank"
              >
                Learn more
              </a>
            </p>
          </div>
          <v-row>
            <v-col cols="12" sm="6" class="mr-n2 mb-n2">
              <mew-button
                has-full-width
                title="Create a new wallet"
                btn-size="xlarge"
                @click.native="$router.push({ name: 'CreateWallet' })"
              />
            </v-col>
            <v-col cols="12" sm="6" class="mb-n2">
              <mew-button
                has-full-width
                btn-style="outline"
                title="Access my wallet"
                btn-size="xlarge"
                @click.native="$router.push({ name: 'AccessWallet' })"
              />
            </v-col>
          </v-row>
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
.mew-component--app-get-started {
  //background: linear-gradient(90deg, #24a2ca 0%, #32bfa5 100%);
  background-color: var(--v-expandHeader-base) !important;
}
.desktop-content {
  padding: 80px 0;
}
.mobile-content {
  padding: 4rem 0;
}
</style>

<style lang="scss">
.mew-component--app-get-started {
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
