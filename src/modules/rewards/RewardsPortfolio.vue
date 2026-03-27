<template>
  <div
    class="rewards-bg rounded-16 h-full flex flex-col justify-center items-center xs:items-start lg-max:items-stretch 2xl:items-stretch px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 2xl:px-4 3xl:px-[33px] pt-5 pb-2 relative overflow-hidden max-h-[293px]"
    :class="{ 'xl:items-stretch': !isOpenSideMenu }"
  >
    <!-- Top section: Text left, Astronaut right -->
    <div class="relative xs:w-full flex items-start justify-between">
      <div
        class="xs:min-w-[122px] mt-[10px] xs:flex-none xs:w-[280px] md:w-auto 2xl:w-[160px] 3xl:w-[194px]"
      >
        <h3
          class="text-s-24 md:text-s-32 lg-max:text-s-28 2xl:text-s-28 font-bold leading-p-100 mb-3 text-center xs:text-start"
          :class="'text-s-32 '"
        >
          Earn $5
          <br
            :class="[
              isOpenSideMenu ? 'xl:hidden' : 'xl:flex',
              'hidden lg-max:flex 2xl:flex',
            ]"
          />USDC
        </h3>
        <p
          class="text-s-16 text-[#334155] leading-p-110 mt-2 max-w-[240px] sm:max-w-none lg-max:max-w-[160px] 2xl:max-w-auto 3xl:max-w-auto 2xl:flex-1 text-center xs:text-start"
          :class="[isOpenSideMenu ? 'xl:max-w-none' : 'xl:max-w-[164px]']"
        >
          First 100 swaps or trades each day <br class="hidden 2xl:flex" />
          over $10 get $5 USDC
        </p>
      </div>
    </div>

    <!-- Remaining Rewards Counter -->
    <div
      class="flex items-center xs:items-start lg-max:items-center 2xl:items-center justify-end flex-col gap-3 w-full pt-4 2xl:pr-6 3xl:pr-0"
      :class="{ 'xl:items-start': isOpenSideMenu }"
    >
      <div
        class="text-s-12 font-light text-info tracking-sp-06 uppercase text-center"
      >
        {{ remainingRewards }} remaining rewards left today
      </div>

      <!-- Actions -->
      <app-base-button
        class="w-full -mt-1 xs:-ml-4 lg-max:ml-0 max-w-[300px]"
        :class="{ 'xl:-ml-4 2xl:ml-0': isOpenSideMenu }"
        @click="goToSwap"
        size="medium"
      >
        Swap Now
      </app-base-button>
      <button
        class="text-s-12 text-[#64748B] text-[10px] font-bold tracking-wider uppercase hoverOpacity cursor-pointer w-full -mt-1 xs:-ml-4 lg-max:ml-0 max-w-[300px]"
        :class="{ 'xl:-ml-4 2xl:ml-0': isOpenSideMenu }"
        @click="onLearnMore"
      >
        Learn More
      </button>
      <rewards-lear-more v-model:is-open="isLearnMoreOpen" />
      <div
        class="hidden xs:block absolute top-5 md:top-2 2xl:-right-4 xs:right-1 sm:right-10 lg-max:right-1 2xl:right-2 3xl:right-2 2xl:pl-4 3xl:pl-[33px]"
      >
        <div class="2xl:pl-[140px] 3xl:pl-[180px]">
          <img
            :src="astronautImg"
            alt=""
            width="160"
            height="167"
            class="w-full h-full object-contain max-h-[180px] md:max-h-[200px] lg-max:max-h-[150px] 2xl:max-h-[168px]"
            :class="[isOpenSideMenu ? 'xl:max-h-[200px]' : 'xl:max-h-[170px]']"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import RewardsLearMore from '@/modules/rewards/RewardsLearMore.vue'
import astronautImg from '@/assets/images/peggy/peggy-usdc.png'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const { setWalletPanel } = walletMenuStore

const remainingRewards = ref(37)
const isLearnMoreOpen = ref(false)

const goToSwap = () => {
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) {
    walletMenuStore.setIsOpenSideMenu(true)
  }
}

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}
</script>

<style scoped>
.rewards-bg {
  background: linear-gradient(135deg, rgba(141, 66, 255, 0.4) 0%, #c7d8ff 100%);
}
</style>
