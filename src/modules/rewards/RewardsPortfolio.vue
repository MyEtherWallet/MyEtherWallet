<template>
  <div
    class="bg-white rounded-16 flex flex-col px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 3xl:px-[33px] pt-8 pb-6 relative overflow-hidden min-h-[250px]"
  >
    <div
      :class="
        isOpenSideMenu ? 'xl:max-w-[450px] min-[1050px]:max-w-[450px]' : ''
      "
    >
      <!-- Top: icon + title -->
      <div class="flex items-start gap-3 mb-3">
        <h3 class="text-s-20 font-bold text-primary leading-tight pt-1">
          Rewards coming soon
        </h3>
      </div>

      <!-- Body text -->
      <p class="text-s-14 text-[#575757] leading-[22px] mb-6">
        We're preparing the next rewards campaign. Follow @myetherwallet on X
        for updates and upcoming announcements.
      </p>

      <!-- CTA -->
      <div class="absolute bottom-[20px] flex items-center gap-2">
        <a
          href="https://x.com/myetherwallet"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 border border-primary text-primary text-s-14 font-medium rounded-full px-4 py-2 hoverOpacity"
        >
          Follow @myetherwallet
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Bottom-right coin image -->
    <img
      :src="coinsIcon"
      alt=""
      :width="130"
      :height="130"
      :class="isOpenSideMenu ? 'min-[1440px]:hidden block' : ''"
      class="absolute bottom-0 right-4 object-contain pointer-events-none opacity-90 max-[1350px]:w-[120px]! hidden min-[500px]:block"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import coinsIcon from '@assets/images/rewards/usdc-disable.png'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
</script>
