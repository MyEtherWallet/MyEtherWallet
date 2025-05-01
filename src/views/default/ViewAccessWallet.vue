<template>
  <main>
    <div
      class="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-space-between mb-8 lg-max:mb-10 mt-12"
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
    <div class="flex xs:justify-center mb-5 md:mb-10">
      <app-dont-have-wallet />
    </div>
    <h2 class="text5 font-semibold mb-4 md:ml-4">
      {{ $t('common.select_network') }}
    </h2>
    <div class="flex flex-row mb-5 gap-5">
      <app-select-chain />
    </div>

    <WalletsDefaultList />
    <div class="flex flex-col items-center my-10">
      <p>Don't Have a Wallet ?</p>

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
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppDontHaveWallet from '@/components/AppDontHaveWallet.vue'

const CREATE_WALLET_PATH_NAME = ROUTES_HOME.CREATE_WALLET.NAME
</script>
