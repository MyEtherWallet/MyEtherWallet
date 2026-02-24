<template>
  <div ref="containerRef" class="relative">
    <!-- Notification Button (hidden on mobile, shown on desktop) -->
    <app-btn-icon
      v-show="!hideButton"
      :label="$t('menu.open-notifications')"
      @click="togglePopup"
    >
      <div class="relative">
        <bell-icon class="w-6 h-6" />
        <!--  dot indicator for unseen orders -->
        <div
          v-if="hasUnseen"
          class="absolute -top-2 -right-1 min-w-4 min-h-4 bg-primary rounded-full unseenNotificationsCount text-[11px] leading-none text-white flex items-center justify-center font-bold px-[4px]"
        >
          {{ unseenNotificationsCount }}
        </div>
      </div>
    </app-btn-icon>

    <!-- Popup -->
    <transition
      enter-from-class="opacity-0 scale-95"
      enter-active-class="transform ease-out duration-200 transition"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-active-class="transform ease-in duration-150 transition"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed left-4 right-auto sm:left-auto sm:right-24 top-20 bottom-4 sm:bottom-auto z-[9999] w-[calc(100vw-80px)] sm:w-[360px] sm:max-h-[calc(100vh-100px)] overflow-hidden bg-white rounded-20 shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 pt-4">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-s-17">Notifications</h3>
            <span
              v-if="unseenNotificationsCount > 0"
              class="bg-primary text-white text-s-12 font-bold px-2 py-0.5 rounded-full"
            >
              {{ unseenNotificationsCount }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <app-btn-text
              v-if="notificationsCount > 0"
              @click="clearAllNotifications"
              class="text-primary text-s-14"
            >
              Clear all
            </app-btn-text>
            <app-btn-icon-close @click="isOpen = false"> </app-btn-icon-close>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="p-3 flex-1 overflow-y-auto">
          <module-notifications ref="tradeNotificationsRef" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { BellIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { useWalletStore } from '@/stores/walletStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnIconClose from '../AppBtnIconClose.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import ModuleNotifications from '@/modules/notifications/ModuleNotifications.vue'
import { onClickOutside } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

// Props
defineProps<{
  hideButton?: boolean
}>()

// Store and wallet
const tradeOrdersStore = useTradeOrdersStore()
const walletStore = useWalletStore()
const walletMenuStore = useWalletMenuStore()
const appLayoutStore = useAppLayoutStore()
const { walletAddress } = storeToRefs(walletStore)
const { isOverflowHidden, isNotificationsOpen } = storeToRefs(appLayoutStore)

// Router for closing AppViewAsDialog
const route = useRoute()
const router = useRouter()

// Container ref for click outside
const containerRef = ref<HTMLElement | null>(null)

// Trade notifications component ref
const tradeNotificationsRef = ref<InstanceType<
  typeof ModuleNotifications
> | null>(null)

// Popup state
const isOpen = ref(false)

// Click outside handler
onClickOutside(containerRef, () => {
  if (isOpen.value) {
    isOpen.value = false
    isNotificationsOpen.value = false
  }
})

// Watch for external trigger to open notifications
watch(isNotificationsOpen, newValue => {
  if (newValue && !isOpen.value) {
    togglePopup()
  }
})

// Check if there are unseen orders
const hasUnseen = computed(() => {
  if (!walletAddress.value) return false
  return tradeOrdersStore.hasUnseenOrders(walletAddress.value)
})

const unseenNotificationsCount = computed(() => {
  if (!walletAddress.value) return 0
  return tradeOrdersStore.getUnseenNotificationsCount(walletAddress.value)
})

// Get notifications count
const notificationsCount = computed(() => {
  if (!walletAddress.value) return 0
  return tradeOrdersStore.getAllNotifications(walletAddress.value).length
})

// Toggle popup
const togglePopup = () => {
  if (isOpen.value && walletAddress.value && hasUnseen.value) {
    // Mark all orders as seen when closing
    tradeOrdersStore.markAllOrdersAsSeen(walletAddress.value)
  }
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Close side menu when opening notifications
    walletMenuStore.setIsOpenSideMenu(false)

    // Close AppViewAsDialog if open (detected by nested routes)
    if (route.matched.length > 1) {
      // Navigate to parent route to close the dialog
      const parentRouteName = route.matched[route.matched.length - 2].name
      isOverflowHidden.value = false
      router.push({ name: parentRouteName })
    }
  }
  isNotificationsOpen.value = isOpen.value
}

// Open popup (for programmatic access from parent)
const openPopup = () => {
  if (!isOpen.value) {
    togglePopup()
  }
}

// Clear all notifications via child component
const clearAllNotifications = () => {
  tradeNotificationsRef.value?.clearAllNotifications()
}

// Expose openPopup for parent component access
defineExpose({
  openPopup,
})
</script>
