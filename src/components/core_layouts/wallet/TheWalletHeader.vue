<template>
  <div
    v-if="!isDesktopAndUp"
    class="flex-initial w-full justify-end h-16 px-6 xs:px-10 bg-white fixed top-0 -mx-5 xs:-mx-10"
  >
    <button
      type="button"
      @click="btnClick"
      class="inline-flex items-center mt-3 p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
const { isDesktopAndUp } = useAppBreakpoints()
const emit = defineEmits<{
  clickMenuBtn: [payload: MouseEvent]
}>()

const btnClick = (payload: MouseEvent) => {
  emit('clickMenuBtn', payload)
}
</script>
