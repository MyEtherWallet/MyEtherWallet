<template>
  <main>
    <div
      class="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-space-between mb-[68px] mt-12"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-start">
        <img
          src="@/assets/images/access/portfolio_icon.webp"
          alt=""
          width="100"
          height="100"
          class="w-[80px] h-[80px] md:w-[109px] md:h-[109px] flex-none"
        />

        <div class="flex-initial mt-3 sm:mt-0 sm:ml-4">
          <h1 class="title1">{{ $t('access_wallet.title') }}</h1>
          <p class="text7 !font-normal">
            {{ $t('access_wallet.description') }}
          </p>
        </div>
      </div>
      <app-need-help
        title="Need help accessing your wallet?"
        help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
        class="sm:ml-[93px] md:ml-[123px] 2xl:ml-auto mt-5 sm:mt-1 xl:mt-2 22xl:mt-0 ml- 2xl:ml-auto"
      />
    </div>

    <WalletsDefaultList />
    <div class="flex flex-col items-center my-10">
      <p>Don't Have a Wallet ?</p>
      <!-- <i18n-t
      keypath="access_wallet.subtext"
      tag="label"
      for="access_wallet.subtext_create_wallet"
      scope="global"
    > -->
      <router-link
        :to="{ name: CREATE_WALLET_PATH_NAME }"
        class="text-center mb-10 underline"
      >
        Create Wallet</router-link
      >
    </div>
    <!-- </i18n-t> -->
    <WalletsList />
  </main>
</template>
<script setup lang="ts">
import { ROUTES_HOME } from '@/router/routeNames'
import WalletsDefaultList from '@/modules/access/components/wallets_lists/WalletsListDefault.vue'
import WalletsList from '@/modules/access/components/wallets_lists/WalletsList.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'

const CREATE_WALLET_PATH_NAME = ROUTES_HOME.CREATE_WALLET.NAME
</script>
