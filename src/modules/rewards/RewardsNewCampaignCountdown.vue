<template>
  <div
    class="flex flex-col justify-between gap-4 rounded-2xl border border-grey-10 bg-white px-5 py-5 xs:px-6 xs:py-6 w-full relative"
  >
    <div class="flex flex-col gap-1">
      <p class="text-s-20 font-bold text-black">Get ready!</p>
      <h2 class="text-s-32 xs:text-s-26 font-bold leading-p-110 text-primary">
        New rewards program
        <br class="hidden sm:block lg:hidden xl:block" />{{ headingLabel }}
      </h2>
    </div>
    <img
      class="absolute bottom-0 right-4 w-[40%] max-w-[160px] min-w-[64px] hidden md:block"
      :src="usdcTokens"
      alt="usdc tokens"
    />
    <p class="text-s-20 font-bold text-black">Stay tuned</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import usdcTokens from '@/assets/images/rewards/usdc-tokens.png'

const LAUNCH_DATE = new Date('2026-05-01T00:00:00.000Z')

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const headingLabel = computed(() => {
  const diff = LAUNCH_DATE.getTime() - now.value
  return diff <= 0 ? 'begins soon' : `begins in ${timeLabel.value}`
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const timeLabel = computed(() => {
  const diff = LAUNCH_DATE.getTime() - now.value
  if (diff <= 0) return 'soon'
  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }
  const mm = totalMinutes.toString().padStart(2, '0')
  const ss = (totalSeconds % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
})
</script>
