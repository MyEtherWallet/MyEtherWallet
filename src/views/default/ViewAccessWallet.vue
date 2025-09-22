<template>
  <main>
    <div class="flex flex-col mb-8 lg-max:mb-10">
      <div class="flex flex-col sm:flex-row justify-start">
        <img
          src="@/assets/images/access/portfolio_icon.webp"
          alt=""
          width="100"
          height="100"
          class="w-[80px] h-[80px] md:w-[109px] md:h-[109px] flex-none"
        />

        <div class="flex-initial sm:mt-0 sm:ml-4">
          <h1 class="title3">Connect to Mew Portfolio</h1>
          <p class="text7 !font-normal">
            {{ $t('access_wallet.description') }}
          </p>
        </div>
      </div>
      <app-need-help
        title="Need help accessing your wallet?"
        help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
        class="sm:ml-[93px] md:ml-[123px] mt-5 sm:mt-1 xl:mt-2"
      />
    </div>

    <div class="flex flex-row flex-wrap mb-5 gap-y-5 gap-x-[54px]">
      <div>
        <h2 class="text5 font-semibold mb-4 md:ml-4">
          {{ $t('common.select_network') }}
        </h2>
        <select-chain-for-app is-btn-group />
      </div>
    </div>
    <WalletsDefaultList class="mt-10 mb-12 sm:mb-[64px]" />
    <WalletsList />
  </main>
</template>
<script setup lang="ts">
import WalletsDefaultList from '@/modules/access/components/wallets_lists/WalletsListDefault.vue'
import WalletsList from '@/modules/access/components/wallets_lists/WalletsList.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { onMounted } from 'vue'
const walletMenu = useWalletMenuStore()

onMounted(() => {
  walletMenu.setIsOpenSideMenu(false)
})
</script>
