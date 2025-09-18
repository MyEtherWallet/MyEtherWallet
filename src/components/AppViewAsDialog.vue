<template>
  <div>
    <!-- The backdrop, rendered as an absolute sibling to the panel container -->
    <transition
      enter-from-class="opacity-0"
      enter-active-class="transform ease-out duration-300 transition"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="ease-in duration-100 transition"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="isOpen"
        class="cursor-pointer fixed inset-0 bg-black/40 overscroll-none overflow-hidden min-w-[320px] min-h-lvh mt-[68px] sm:mt-[76px]"
        :class="zIndexOverlay"
        @click="setIsOpen(false)"
        aria-hidden
      />
    </transition>
    <!-- Dialog Container -->
    <div
      v-if="isOpen"
      :class="[isOpenSideMenu ? 'mr-[400px]' : 'mr-[60px]', zIndexContainer]"
      class="cursor-pointer fixed inset-0 flex items-center justify-center p-6 overscroll-none !overflow-y-scroll mt-[68px] sm:mt-[76px]"
      @click="setIsOpen(false)"
    >
      <transition
        enter-active-class="transform ease-out duration-400 transition opacity-0 delay-100"
        enter-to-class="opacity-100"
        leave-active-class="opacity-0"
        leave-to-class="opacity-0"
        appear
      >
        <div
          v-if="isOpen"
          class="cursor-default max-h-[95%] w-[95%] bg-white rounded-32 sm:min-h-[512px] !overflow-y-scroll overflow-hidden relative"
          @click.stop
          v-bind="$attrs"
        >
          <app-btn-icon-close
            @click="setIsOpen(false)"
            class="absolute top-4 right-4 min-w-[32px]"
          />
          <div class="py-2 px-6">
            <slot name="content" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * @description nested dialog component to display content in a router-view
 * @example
 */
import AppBtnIconClose from './AppBtnIconClose.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppLayoutStore } from '@/stores/appLayoutStore'
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const appLayoutStore = useAppLayoutStore()
const { isOverflowHidden } = storeToRefs(appLayoutStore)
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)

/**
 *  the overflow hidden on the body
 */
onMounted(() => {
  isOverflowHidden.value = true
})
defineProps({
  zIndexOverlay: {
    default: 'z-[10]',
    type: String,
  },
  zIndexContainer: {
    default: 'z-[11]',
    type: String,
  },
})

/**
 * @isOpen controls the state of the dialog.
 */
const isOpen = ref(true)

const route = useRoute()
const router = useRouter()
/**
 * @setIsOpen - function to set the dialog state
 * @param _value - boolean value to set the dialog state
 */
const setIsOpen = (_value: boolean = false) => {
  if (route.matched.length > 1) {
    // The parent route is the second to last item in the matched array
    const parentRouteName = route.matched[route.matched.length - 2].name
    isOpen.value = _value
    isOverflowHidden.value = false
    router.push({ name: parentRouteName })
  }
}
</script>
