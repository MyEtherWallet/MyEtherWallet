<script setup lang="ts">
// Preview for the Address selector design-library component (MEW-2462) at
// /dev/address-selector. Matches Figma component set 892:2786
// (Connected × Name × Status), on the white surface the Navbar sits on.
import { ref } from 'vue'
import AppAddressSelector from '@/components/navbar/AppAddressSelector.vue'
import ethIcon from '@/assets/icons/tokens/eth.svg'

const ADDRESS = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
const BALANCE = '$130.23'

const COMBINATIONS = [
  { label: 'Connected · Name', connected: true, name: 'Savings account' },
  { label: 'Connected · No name', connected: true, name: undefined },
  { label: 'Watch only · Name', connected: false, name: 'Savings account' },
  { label: 'Watch only · No name', connected: false, name: undefined },
]

const STATUSES = [
  { label: 'Default', open: false },
  { label: 'Hover (point at it)', open: false },
  { label: 'Open', open: true },
]

const isOpen = ref(false)
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Address selector</h1>
      <p class="text-text-sm text-text-subtle">
        Navbar trigger for the active account; opens the account menu.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Connected × Name × Status</h2>
      <div
        class="grid w-fit grid-cols-4 items-center gap-x-8 gap-y-6 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <span />
        <p v-for="status in STATUSES" :key="status.label" class="text-label-sm">
          {{ status.label }}
        </p>
        <template v-for="combo in COMBINATIONS" :key="combo.label">
          <p class="text-text-sm text-text-subtle">{{ combo.label }}</p>
          <div v-for="status in STATUSES" :key="status.label">
            <AppAddressSelector
              :address="ADDRESS"
              :name="combo.name"
              :balance="BALANCE"
              :connected="combo.connected"
              :network-icon="ethIcon"
              :open="status.open"
            />
          </div>
        </template>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">App states beyond Figma</h2>
      <div
        class="flex w-fit flex-col items-start gap-4 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppAddressSelector
          :address="ADDRESS"
          name="Savings account"
          loading
          :network-icon="ethIcon"
        />
        <AppAddressSelector :network-icon="ethIcon" />
        <AppAddressSelector
          :address="ADDRESS"
          name="My very long account name for the long weekend"
          :balance="BALANCE"
          :network-icon="ethIcon"
        />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Live</h2>
      <div
        class="flex w-fit items-center gap-4 rounded-12 border border-border-default bg-background-alternative p-6"
      >
        <AppAddressSelector
          :address="ADDRESS"
          name="Savings account"
          :balance="BALANCE"
          :network-icon="ethIcon"
          :open="isOpen"
          @click="isOpen = !isOpen"
        />
        <p class="text-text-sm text-text-subtle">
          aria-expanded: {{ isOpen }} (Tab to it to see the focus ring)
        </p>
      </div>
    </section>
  </div>
</template>
