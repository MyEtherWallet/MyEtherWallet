<template>
  <div
    class="flex flex-col justify-center items-center gap-3 rounded-20 border-1 border-[rgba(218,218,218,1)] p-2 min-h-[154px]"
  >
    <p class="">{{ $t('common.dont_have_wallet') }}</p>
    <app-base-button
      isOutline
      class="bg-white h-12 !py-0 !px-0 w-full"
      @onClick="$router.push({ name: CREATE_WALLET_PATH_NAME })"
    >
      <span> {{ $t('common.create_wallet') }}</span>
    </app-base-button>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import { ROUTES_HOME } from '@/router/routeNames'

const CREATE_WALLET_PATH_NAME = ROUTES_HOME.CREATE_WALLET.NAME
</script>
