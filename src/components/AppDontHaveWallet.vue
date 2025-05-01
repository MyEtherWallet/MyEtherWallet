<template>
  <div
    class="flex flex-col xs:flex-row justify-start items-center gap-3 xs:gap-6 rounded-2xl xs:rounded-32 p-2 max-w-fit border-1 border-[rgba(232,232,237,1)] p-2"
  >
    <p class="xs:ml-4">{{ $t('common.dont_have_wallet') }}</p>
    <app-base-button isOutline class="bg-white h-12 !py-0">
      <span> {{ $t('common.create_new_wallet') }}</span>
    </app-base-button>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
</script>
