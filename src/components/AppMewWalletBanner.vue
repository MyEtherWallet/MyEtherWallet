<template>
  <Teleport to="body">
    <transition name="banner-slide">
      <div
        v-if="isVisible"
        class="fixed left-0 bottom-0 z-50 flex justify-center overflow-hidden shadow-2xl banner-bg left-6 bottom-8 w-[550px] h-[245px] rounded-2xl justify-start"
      >
        <!-- Close button -->
        <button
          class="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-colors z-10"
          @click="dismiss"
          aria-label="Close banner"
        >
          <XCircleIcon class="w-5 h-5" />
        </button>

        <div class="block pl-7 pr-6 py-5 z-10 relative">
          <p class="font-bold text-s-28 text-black leading-[60px] mb-1">
            Get MEW app
          </p>
          <p
            class="text-s-22 leading-[110%] mb-4 font-medium banner-gradient-text"
          >
            Earn tokenized stock rewards
            <br />from a $100,000 pool
          </p>

          <!-- Download button + QR -->
          <div class="flex items-center gap-3 mb-4">
            <a
              href="https://mewwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-5 py-2 rounded-full bg-primary text-white font-medium text-s-16 whitespace-nowrap"
            >
              Download now
            </a>
            <button
              class="relative"
              @mouseenter="showQr = true"
              @mouseleave="showQr = false"
            >
              <div
                class="w-10 h-10 bg-grey-light rounded-full flex items-center justify-center cursor-pointer"
              >
                <QrCodeIcon class="w-5 h-5" />
              </div>
              <div
                v-if="showQr"
                class="absolute top-1/2 -translate-y-[70%] left-full ml-3 bg-white rounded-2xl shadow-xl p-3 w-[150px] h-[170px] flex flex-col z-20"
              >
                <p class="text-xs font-semibold text-black mb-2">
                  Scan to download
                </p>
                <img
                  :src="qrCode"
                  alt="QR code"
                  class="w-full flex-1 object-contain"
                />
              </div>
            </button>
          </div>

          <!-- Store badges -->
          <div class="flex items-center gap-3">
            <a
              href="https://apps.apple.com/app/mew-crypto-wallet-buy-eth/id1464614025"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img :src="appStoreIos" alt="App Store" class="h-5 mr-2" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img :src="appStoreGoogle" alt="Google Play" class="h-5" />
            </a>
          </div>
        </div>
        <div
          class="z-0 flex items-end overflow-hidden self-stretch absolute right-[-10px]"
        >
          <img :src="mewBannerItem" alt="Mew wallet app" class="h-[245px]" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { QrCodeIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import mewBannerItem from '@/assets/images/mew-banner-item.png'
import appStoreIos from '@/assets/images/common/app-store-apple-grey.png'
import appStoreGoogle from '@/assets/images/common/app-store-google-grey.png'
import qrCode from '@/assets/images/qr-code-mew-wallet-dl.png'

const STORAGE_KEY = 'mew-app-banner-dismissed'
const isVisible = ref(false)
const showQr = ref(false)

const checkVisibility = () => {
  const dismissed = sessionStorage.getItem(STORAGE_KEY)
  isVisible.value = !dismissed
}

const dismiss = () => {
  sessionStorage.setItem(STORAGE_KEY, '1')
  isVisible.value = false
}

onMounted(() => {
  checkVisibility()
  window.addEventListener('resize', checkVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkVisibility)
})
</script>

<style scoped>
.banner-bg {
  background:
    linear-gradient(
      276.99deg,
      rgba(255, 255, 255, 0.3) -49.23%,
      rgba(255, 255, 255, 0.9) 93.05%
    ),
    url('@/assets/images/backgrounds/mew-wallet-new-season-banner.png');
  background-size: 100% 100%;
}

.banner-gradient-text {
  background: linear-gradient(
    90deg,
    #ff5d3d 0%,
    #ff7526 6%,
    #ff8c00 16%,
    #d5ab00 35%,
    #aac137 43%,
    #7ed06d 60%,
    #55daa2 80%,
    #40e0d0 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.banner-slide-enter-active {
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}
.banner-slide-leave-active {
  transition:
    transform 0.25s ease-in,
    opacity 0.2s ease;
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 1920px) {
  .banner-slide-enter-from,
  .banner-slide-leave-to {
    transform: translateX(calc(-100% - 1.5rem));
  }
}
</style>
