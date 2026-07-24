<template>
  <div
    class="flex flex-col justify-between gap-4 rounded-2xl border border-grey-10 bg-white px-5 py-5 xs:px-6 xs:py-6 w-full relative"
  >
    <div class="flex flex-col gap-1">
      <p class="text-s-20 font-bold text-black">{{ t('rewards.get_ready') }}</p>
      <h2 class="text-s-32 xs:text-s-26 font-bold leading-p-110 text-primary">
        {{ t('rewards.new_rewards_program') }}
        <br class="hidden sm:block lg:hidden xl:block" />{{ headingLabel }}
      </h2>
    </div>
    <img
      class="absolute bottom-0 right-4 w-[40%] max-w-[160px] min-w-[64px] hidden md:block"
      :src="usdcTokens"
      alt=""
    />
    <p class="text-s-20 font-bold text-black">{{ t('rewards.stay_tuned') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import usdcTokens from '@/assets/images/rewards/usdc-tokens.png'

const { t } = useI18n()

const LAUNCH_DATE = new Date('2026-05-01T00:00:00.000Z')

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const headingLabel = computed(() => {
  const diff = LAUNCH_DATE.getTime() - now.value
  return diff <= 0
    ? t('rewards.begins_soon')
    : t('rewards.begins_in', { time: timeLabel.value })
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
  if (diff <= 0) return t('rewards.soon')
  const totalSeconds = Math.floor(diff / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    return `${hours} ${t('rewards.hours', hours)}`
  }
  const mm = totalMinutes.toString().padStart(2, '0')
  const ss = (totalSeconds % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
})
</script>
