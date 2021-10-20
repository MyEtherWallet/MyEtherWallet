<template>
  <v-container class="mew-unstoppable-info">
    <v-row class="flex-column flex-lg-row" align="center">
      <v-col lg="6" class="d-flex justify-end">
        <v-img src="@/assets/images/snippets/buy-domain.png" />
      </v-col>
      <v-col lg="6" class="text-content pr-12 mt-4 mt-lg-0">
        <h2 class="mb-5">
          Replace your crypto addresses with a human readable name
        </h2>
        <div class="mb-4 d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/icons/icon-dapp-friend.svg" />
          </div>
          <div>
            Rather than a long ethereum address, your friends can send ETH to a
            domian name.
          </div>
        </div>

        <div class="mb-4 d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/icons/icon-dapp-bag.svg" />
          </div>
          <div>
            Domains don’t expire. Pay only once and own your domain for life.
          </div>
        </div>

        <div class="d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/icons/icon-dapp-share.svg" />
          </div>
          <div>
            Domains don’t just work for Ethereum — Link your domian to as many
            crypto addresses as you’d like on any blockchain.
          </div>
        </div>
        <div class="d-flex mt-5 primary--text">
          Learn more about Domain Names
          <v-icon color="primary" small class="ml-1">mdi-open-in-new</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.mew-unstoppable-info {
  border: 1px solid #d2d9e7;
  border-radius: 12px;
}
</style>
