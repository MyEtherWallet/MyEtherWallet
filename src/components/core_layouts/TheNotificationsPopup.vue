<template>
  <div ref="containerRef" class="relative">
    <!-- Notification Button (hidden on mobile, shown on desktop) -->
    <app-btn-icon :label="$t('menu.open-notifications')" @click="togglePopup">
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
    <teleport to="#app">
      <transition
        enter-from-class="opacity-0 scale-95"
        enter-active-class="transform ease-out duration-200 transition"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-active-class="transform ease-in duration-150 transition"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-show="isNotificationsOpen"
          ref="popupRef"
          :style="popupStyle"
          class="fixed z-[2101] w-[calc(100vw-32px)] sm:w-[360px] max-h-[calc(100vh-100px)] overflow-hidden bg-white rounded-20 shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.32)] flex flex-col"
        >
          <!-- Header (drag handle on desktop only) -->
          <div
            ref="dragHandleRef"
            :class="[
              'flex items-center justify-between px-4 pt-4 select-none',
              !isMobile && 'cursor-move',
            ]"
          >
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-s-17 group flex items-center gap-1">
                {{ $t('notifications_module.title') }}
              </h3>

              <span
                v-if="unseenNotificationsCount > 0"
                class="bg-primary text-white text-s-12 font-bold px-2 py-0.5 rounded-full"
              >
                {{ unseenNotificationsCount }}
              </span>
              <img
                v-if="!isMobile"
                :src="dragIcon"
                alt="drag"
                :class="[
                  isHovered ? 'opacity-100' : 'opacity-0',
                  'ml-1 w-5 h-5 transition-opacity align-middle inline-block',
                ]"
              />
            </div>
            <div class="flex items-center gap-2">
              <app-tooltip
                v-if="!isMobile"
                :text="isPinned ? $t('notifications_module.unpin') : $t('notifications_module.pin_to_keep_open')"
                position="top-left"
              >
                <app-btn-icon
                  :label="isPinned ? $t('notifications_module.unpin') : $t('notifications_module.pin')"
                  @click="isPinned = !isPinned"
                  class="text-primary"
                >
                  <img
                    :src="pinIcon"
                    alt="pin"
                    :class="[{ grayscale: !isPinned }, 'w-5 h-5']"
                  />
                </app-btn-icon>
              </app-tooltip>
              <app-btn-icon-close @click="togglePopup"> </app-btn-icon-close>
            </div>
          </div>

          <!-- Notifications List -->
          <div class="p-3 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <module-notifications ref="tradeNotificationsRef" />
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { analytics, NotificationEvent } from '@/analytics'
import { BellIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { useTradeOrdersStore } from '@/stores/tradeOrdersStore'
import { useWalletStore } from '@/stores/walletStore'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnIconClose from '../AppBtnIconClose.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import ModuleNotifications from '@/modules/notifications/ModuleNotifications.vue'
import {
  onClickOutside,
  useDraggable,
  useLocalStorage,
  useElementHover,
  useWindowSize,
} from '@vueuse/core'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import pinIcon from '@/assets/icons/pin-icon.svg'
import dragIcon from '@/assets/icons/drag-icon.svg'

// Breakpoints
const { isMobile } = useAppBreakpoints()

// Store and wallet
const tradeOrdersStore = useTradeOrdersStore()
const walletStore = useWalletStore()
const appLayoutStore = useAppLayoutStore()
const { walletAddress } = storeToRefs(walletStore)
const { isNotificationsOpen } = storeToRefs(appLayoutStore)

// Container ref for click outside
const containerRef = ref<HTMLElement | null>(null)

// Popup and drag handle refs
const popupRef = ref<HTMLElement | null>(null)
const dragHandleRef = ref<HTMLElement | null>(null)

const isHovered = useElementHover(dragHandleRef)
// Trade notifications component ref
const tradeNotificationsRef = ref<InstanceType<
  typeof ModuleNotifications
> | null>(null)

// Popup state
const isPinned = ref(false)
const openedAt = ref<number | null>(null)

// Persisted position in localStorage
const savedPosition = useLocalStorage('notificationsPopupPosition', {
  x: window.innerWidth - 360 - 96, // default: right-24 (96px from right)
  y: 80, // default: top-20 (80px from top)
})

// Draggable functionality (disabled on mobile)
const { x, y } = useDraggable(popupRef, {
  handle: dragHandleRef,
  initialValue: { x: savedPosition.value.x, y: savedPosition.value.y },
  onStart: () => {
    // Prevent dragging on mobile
    if (isMobile.value) return false
  },
  onEnd: () => {
    // Save position when drag ends (only on desktop)
    if (!isMobile.value) {
      savedPosition.value = { x: x.value, y: y.value }
    }
  },
})

// Computed style for popup position
const popupStyle = computed(() => {
  if (isMobile.value) {
    // Position below the notification button on mobile
    const buttonEl = containerRef.value
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect()
      return {
        right: '16px',
        top: `${rect.bottom + 8}px`,
      }
    }
    // Fallback if ref not available
    return {
      right: '16px',
      top: '60px',
    }
  }
  return {
    left: `${x.value}px`,
    top: `${y.value}px`,
  }
})

// Initialize position when popup opens (only on desktop)
watch(isNotificationsOpen, async newValue => {
  if (newValue) {
    openedAt.value = Date.now()
    analytics.trackNotificationEvent(NotificationEvent.SHOWN)
    if (!isMobile.value) {
      await nextTick()
      // Restore saved position, ensuring it's within viewport bounds
      const maxX = window.innerWidth - 360
      const maxY = window.innerHeight - 100
      x.value = Math.min(Math.max(0, savedPosition.value.x), maxX)
      y.value = Math.min(Math.max(0, savedPosition.value.y), maxY)
    }
  } else {
    const duration =
      openedAt.value !== null
        ? Math.round((Date.now() - openedAt.value) / 1000)
        : undefined
    openedAt.value = null
    analytics.trackNotificationEvent(NotificationEvent.CLOSED, { duration })
  }
})

// Keep popup visible when window is resized
const { width: windowWidth, height: windowHeight } = useWindowSize()

watch(isPinned, newValue => {
  if (newValue) {
    analytics.trackNotificationEvent(NotificationEvent.PINNED)
  }
})

watch([windowWidth, windowHeight], () => {
  if (!isNotificationsOpen.value || isMobile.value) return

  // Ensure popup stays within viewport bounds on desktop
  const maxX = windowWidth.value - 360
  const maxY = windowHeight.value - 100

  if (x.value > maxX) {
    x.value = Math.max(0, maxX)
    savedPosition.value = { x: x.value, y: y.value }
  }
  if (y.value > maxY) {
    y.value = Math.max(0, maxY)
    savedPosition.value = { x: x.value, y: y.value }
  }
})

// Click outside handler - ignore clicks on the popup itself, and skip if pinned (pin disabled on mobile)
onClickOutside(
  containerRef,
  () => {
    const shouldRespectPin = !isMobile.value && isPinned.value
    if (isNotificationsOpen.value && !shouldRespectPin) {
      togglePopup()
    }
  },
  { ignore: [popupRef] },
)

// Check if there are unseen orders
const hasUnseen = computed(() => {
  if (!walletAddress.value) return false
  return tradeOrdersStore.hasUnseenOrders(walletAddress.value)
})

const unseenNotificationsCount = computed(() => {
  if (!walletAddress.value) return 0
  return tradeOrdersStore.getUnseenNotificationsCount(walletAddress.value)
})

// Toggle popup
const togglePopup = () => {
  if (isNotificationsOpen.value && walletAddress.value && hasUnseen.value) {
    // Mark all orders as seen when closing
    tradeOrdersStore.markAllOrdersAsSeen(walletAddress.value)
  }
  isNotificationsOpen.value = !isNotificationsOpen.value
}

// Open popup (for programmatic access from parent)
const openPopup = () => {
  if (!isNotificationsOpen.value) {
    togglePopup()
  }
}

// Expose openPopup for parent component access
defineExpose({
  openPopup,
})
</script>
