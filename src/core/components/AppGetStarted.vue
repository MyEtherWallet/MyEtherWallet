<template>
  <div class="mew-component--get-started">
    <v-container>
      <v-row class="align-center py-10">
        <v-col cols="12" md="5">
          <h2 class="font-weight--700 white--text mb-3">
            Ready to explore Ethereum?
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
        </v-col>
        <v-col cols="12" md="7">
          <v-row class="align-center" justify="start" justify-md="end">
            <v-col cols="12" sm="4" xl="3" class="py-1">
              <mew-button
                has-full-width
                title="Create a new wallet"
                btn-size="xlarge"
                @click.native="$router.push({ name: 'CreateWallet' })"
              />
            </v-col>
            <v-col cols="12" sm="4" xl="3" class="py-1">
              <mew-button
                has-full-width
                btn-style="outline"
                title="Access my wallet"
                btn-size="xlarge"
                @click.native="$router.push({ name: 'AccessWallet' })"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AppGetStarted',
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.mew-component--get-started {
  background-color: var(--v-expandHeader-base) !important;
}
</style>
