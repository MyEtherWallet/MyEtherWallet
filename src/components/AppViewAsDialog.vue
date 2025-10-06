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
        @click="closeDialog()"
        aria-hidden
      />
    </transition>
    <!-- Dialog Container -->
    <div
      v-if="isOpen"
      :class="[
        isOpenSideMenu ? 'mr-[445px]' : 'mr-[60px] xs:mr-[70px]',
        zIndexContainer,
      ]"
      class="cursor-pointer fixed inset-0 flex items-center justify-end pl-3 ls:pl-6 overscroll-none !overflow-y-scroll mt-[69px] sm:mt-[77px]"
      @click="closeDialog()"
    >
      <transition
        enter-from-class="opacity-0 translate-x-full"
        enter-active-class="transform ease-out duration-300 transition "
        enter-to-class="-translate-x-0"
        leave-from-class="transform ease-out duration-300 -translate-x-0"
        leave-active-class=" translate-x-full"
        appear
      >
        <div
          v-if="isOpen"
          :class="[
            'cursor-default  w-[100%] max-w-[1384px] bg-white rounded-l-16 lg:rounded-l-32 h-[calc(100vh-69px)] sm:h-[calc(100vh-77px)] !overflow-y-scroll overflow-hidden relative',
            containerClass,
          ]"
          @click.stop
          v-bind="$attrs"
        >
          <app-btn-icon-close
            @click="closeDialog()"
            class="absolute top-2 sm:top-4 right-4 min-w-[32px]"
          />
          <div>
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
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { ROUTES_MAIN } from '@/router/routeNames'
const appLayoutStore = useAppLayoutStore()
const { isOverflowHidden } = storeToRefs(appLayoutStore)
const walletMenu = useWalletMenuStore()
const { isOpenSideMenu, hasShadow } = storeToRefs(walletMenu)

/**
 *  the overflow hidden on the body
 */
onMounted(() => {
  isOverflowHidden.value = true
  hasShadow.value = false
})
defineProps({
  zIndexOverlay: {
    default: 'z-[10]',
    type: String,
  },
  zIndexContainer: {
    default: 'z-[51]',
    type: String,
  },
  containerClass: {
    default: '',
    type: String,
  },
})

/**
 * @isOpen controls the state of the dialog.
 */
const isOpen = ref(true)

const { isXLAndUp } = useAppBreakpoints()
const route = useRoute()
const router = useRouter()
/**
 * @closeDialog - function to set the dialog state
 * @param _value - boolean value to set the dialog state
 */
const closeDialog = () => {
  if (!isXLAndUp.value) {
    walletMenu.setIsOpenSideMenu(false)
  }
  isOpen.value = false
  hasShadow.value = true
  isOverflowHidden.value = false
  if (route.matched.length > 1) {
    // The parent route is the second to last item in the matched array
    const parentRouteName = route.matched[route.matched.length - 2].name

    router.push({ name: parentRouteName })
  } else {
    router.push({ name: ROUTES_MAIN.HOME.NAME })
  }
}
</script>
