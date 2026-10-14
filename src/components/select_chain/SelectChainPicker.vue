<script setup lang="ts">
/**
 * SelectChainForApp rendered as the design-library Picker pill (size S).
 * Every attribute and listener (passed-chains, can-store, preselected-chain,
 * @update:selected-chain…) falls through to SelectChainForApp, which keeps the
 * dialog and the chain logic.
 */
import AppPicker from '@/components/picker/AppPicker.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import SelectChainForApp from './SelectChainForApp.vue'
</script>

<template>
  <SelectChainForApp>
    <template #network-button="{ openNetworkDialog, selectedChain }">
      <AppPicker
        size="s"
        :title="selectedChain?.nameLong ?? ''"
        :loading="!selectedChain"
        :aria-label="$t('common.select_network')"
        @click.stop="openNetworkDialog(true)"
      >
        <template #avatar="{ size }">
          <AppAvatar type="network" :chain="selectedChain?.name" :size="size" />
        </template>
      </AppPicker>
    </template>
  </SelectChainForApp>
</template>
