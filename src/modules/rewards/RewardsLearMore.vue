<template>
  <app-dialog v-model:is-open="isOpenModel" class="sm:max-w-[680px] sm:mx-auto">
    <template #content>
      <div class="flex flex-col sm:flex-row overflow-hidden">
        <!-- Left Panel: Gradient + Astronaut -->
        <div
          class="hidden rewards-left-bg sm:flex flex-col items-center justify-center px-6 py-8 sm:px-8 sm:w-[260px] sm:min-w-[280px] sm:min-h-[500px]"
        >
          <img
            :src="astronautImg"
            alt=""
            class="w-[140px] sm:w-[202px] object-contain mb-6 -scale-x-100"
            width="202"
            height="210"
          />
          <h2
            class="sm:text-s-32 font-semibold leading-p-120 text-primary text-center sm:text-left uppercase w-full"
          >
            Exclusive<br />Daily<br />Reward
          </h2>
        </div>

        <!-- Right Panel: Content -->
        <div class="flex-1 px-6 sm:px-8 py-6 sm:pt-10 flex flex-col">
          <h3
            class="text-s-24 sm:text-s-32 font-bold text-primary leading-p-120"
          >
            Earn $5 USDC on Every Eligible Swap
          </h3>
          <p class="text-s-14 text-info mt-3 leading-p-160">
            Complete a swap over $10 and receive $5 USDC — available to the
            first 100 users each day.
          </p>

          <!-- How It Works -->
          <h4
            class="text-s-11 font-semibold text-violet tracking-sp-06 uppercase mt-8"
          >
            How It Works
          </h4>
          <div class="flex flex-col gap-3 sm:gap-4 mt-4">
            <div
              v-for="item in howItWorks"
              :key="item.text"
              class="flex items-start gap-3"
            >
              <div
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-violet/10 flex items-center justify-center shrink-0"
              >
                <icon-swap
                  v-if="item.icon === 'swap'"
                  class="w-3 h-3 sm:w-4 sm:h-4 text-violet"
                />
                <gift-icon
                  v-else-if="item.icon === 'gift'"
                  class="w-3 h-3 sm:w-4 sm:h-4 text-violet"
                />
                <currency-dollar-icon
                  v-else-if="item.icon === 'currency-dollar'"
                  class="w-3 h-3 sm:w-4 sm:h-4 text-violet"
                />
                <span v-else class="text-s-14">{{ item.icon }}</span>
              </div>
              <p class="text-s-12 sm:text-s-14 text-info leading-snug pt-1">
                {{ item.text }}
              </p>
            </div>
          </div>

          <!-- Availability -->
          <h4
            class="text-s-11 font-semibold text-violet tracking-sp-06 uppercase mt-8"
          >
            Availability
          </h4>
          <div class="flex flex-col gap-4 mt-4">
            <div
              v-for="item in availability"
              :key="item.text"
              class="flex items-start gap-3"
            >
              <div
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-violet/10 flex items-center justify-center shrink-0"
              >
                <clock-icon
                  v-if="item.icon === 'clock'"
                  class="w-3 h-3 sm:w-4 sm:h-4 text-violet"
                />
                <calendar-icon
                  v-else-if="item.icon === 'calendar'"
                  class="w-3 h-3 sm:w-4 sm:h-4 text-violet"
                />
                <arrow-trending-down-icon
                  v-else-if="item.icon === 'trending-down'"
                  class="w-4 h-4 text-violet"
                />
                <span v-else class="text-s-14">{{ item.icon }}</span>
              </div>
              <p class="text-s-12 sm:text-s-14 text-info leading-snug pt-1">
                {{ item.text }}
              </p>
            </div>
          </div>

          <!-- CTA Button -->
          <app-base-button class="w-full mt-6" @click="onEarnReward">
            Earn Your Reward
          </app-base-button>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import astronautImg from '@/assets/images/peggy/peggy-usdc.png'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import {
  GiftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from '@heroicons/vue/24/solid'

const isOpenModel = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
const { setWalletPanel } = walletMenu

const howItWorks = [
  { icon: 'swap', text: 'Make a swap or trade of $10 or more' },
  {
    icon: 'currency-dollar',
    text: "If you're within the first 100, you earn $5 USDC",
  },
  {
    icon: 'gift',
    text: 'One reward per wallet per day, sent directly to your wallet',
  },
]

const availability = [
  { icon: 'clock', text: 'Limited to 100 rewards per day' },
  { icon: 'trending-down', text: 'Live counter shows remaining rewards' },
  { icon: 'calendar', text: 'If rewards run out, try again the next day' },
]

const onEarnReward = () => {
  isOpenModel.value = false
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
}
</script>

<style scoped>
.rewards-left-bg {
  background: linear-gradient(162deg, #ebdcff 0%, #dde1ff 100%);
}
</style>
