<script setup lang="ts">
// DEV-only gallery for the Avatar design-library component (MEW-2196). Not
// registered in production builds — see routesDefault.ts. Lets us eyeball all
// Type × Size combinations, badges and states against Figma.
import { PlusIcon, CheckIcon, BellIcon } from '@heroicons/vue/24/solid'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppAvatarCard from '@/components/avatar/AppAvatarCard.vue'
import type {
  AvatarSize,
  AvatarStatus,
  AvatarType,
  PaymentMethod,
  WalletId,
} from '@/components/avatar/types'

const SIZES: AvatarSize[] = ['xs', 's', 'm', 'l', 'xl']
const TYPES: AvatarType[] = [
  'initial',
  'account',
  'icon',
  'network',
  'stocks',
  'cryptoAsset',
  'perpsAsset',
  'wallet',
]
const STATUSES: AvatarStatus[] = ['error', 'warning', 'success', 'muted']
const PAYMENTS: PaymentMethod[] = [
  'applePay',
  'gPay',
  'masterCard',
  'paypal',
  'pix',
  'visa',
]
const WALLETS: WalletId[] = [
  'ledger',
  'rainbow',
  'walletconnect',
  'metamaskstarknetsnap',
  'rabby',
  'phantom',
  'coinbase',
  'solflare',
  'zerion',
  'any',
]

const SAMPLE = {
  address: '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8',
  symbol: 'AAPL',
  chain: 'Ethereum',
  initial: 'R',
  walletId: 'ledger' as WalletId,
}
</script>

<template>
  <div class="p-8 flex flex-col gap-12 max-w-5xl mx-auto">
    <h1 class="text-s-24 font-bold">Avatar — design library (MEW-2196)</h1>

    <!-- 40 Type × Size combinations -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Type × Size</h2>
      <div class="overflow-x-auto">
        <table class="border-separate border-spacing-4">
          <thead>
            <tr>
              <th class="text-s-12 text-info text-left">type \ size</th>
              <th
                v-for="s in SIZES"
                :key="s"
                class="text-s-12 text-info uppercase"
              >
                {{ s }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in TYPES" :key="t">
              <td class="text-s-12 text-info pr-4">{{ t }}</td>
              <td v-for="s in SIZES" :key="s" class="text-center">
                <AppAvatar
                  :type="t"
                  :size="s"
                  :address="SAMPLE.address"
                  :symbol="SAMPLE.symbol"
                  :chain="SAMPLE.chain"
                  :initial="SAMPLE.initial"
                  :wallet-id="SAMPLE.walletId"
                >
                  <template v-if="t === 'icon'" #icon><PlusIcon /></template>
                </AppAvatar>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Wallet marks (real assets from Figma _Wallets 166:15) -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Wallet marks</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <div
          v-for="w in WALLETS"
          :key="w"
          class="flex flex-col items-center gap-2"
        >
          <AppAvatar type="wallet" size="l" :wallet-id="w" />
          <span class="text-s-12 text-info">{{ w }}</span>
        </div>
      </div>
    </section>

    <!-- Badges: 4 positions -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Badges (M) — one per avatar</h2>
      <div class="flex gap-10 items-center">
        <AppAvatar type="cryptoAsset" size="xl" symbol="ETH" badge-bottom>
          <template #badge>
            <AppAvatarBadge type="network" size="xl"
              ><PlusIcon
            /></AppAvatarBadge>
          </template>
        </AppAvatar>
        <AppAvatar type="stocks" size="xl" symbol="AAPL" badge-top-left>
          <template #badge>
            <AppAvatarBadge type="icon" size="xl"><PlusIcon /></AppAvatarBadge>
          </template>
        </AppAvatar>
        <AppAvatar type="account" size="xl" :address="SAMPLE.address" badge-top>
          <template #badge>
            <AppAvatarBadge type="status" size="xl" status="success" />
          </template>
        </AppAvatar>
        <AppAvatar type="initial" size="xl" initial="M" badge-bottom-left>
          <template #badge>
            <AppAvatarBadge type="icon" size="xl"><CheckIcon /></AppAvatarBadge>
          </template>
        </AppAvatar>
      </div>
    </section>

    <!-- Status dots -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Status dots</h2>
      <div class="flex gap-10 items-center">
        <AppAvatar
          v-for="st in STATUSES"
          :key="st"
          type="account"
          size="xl"
          :address="SAMPLE.address"
          badge-top
        >
          <template #badge>
            <AppAvatarBadge type="status" size="xl" :status="st" />
          </template>
        </AppAvatar>
      </div>
    </section>

    <!-- Account connected -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Account — connected ring</h2>
      <div class="flex gap-10 items-center">
        <AppAvatar type="account" size="xl" :address="SAMPLE.address" />
        <AppAvatar
          type="account"
          size="xl"
          :address="SAMPLE.address"
          connected
        />
      </div>
    </section>

    <!-- Fallback legibility: white card vs app bg -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Fallback bg (transparent logo)</h2>
      <div class="flex gap-10">
        <div class="bg-white p-4 rounded-16">
          <AppAvatar type="network" size="xl" />
        </div>
        <div class="bg-app-background p-4 rounded-16">
          <AppAvatar type="network" size="xl" />
        </div>
        <div class="bg-white p-4 rounded-16">
          <AppAvatar type="icon" size="xl">
            <template #icon><BellIcon /></template>
          </AppAvatar>
        </div>
      </div>
    </section>

    <!-- Payment cards (Avatar-Cards, node 520:3673) -->
    <section class="flex flex-col gap-4">
      <h2 class="text-s-16 font-semibold">Payment cards</h2>
      <div class="flex gap-4 items-center">
        <div
          v-for="m in PAYMENTS"
          :key="m"
          class="flex flex-col items-center gap-2"
        >
          <AppAvatarCard :method="m" />
          <span class="text-s-12 text-info">{{ m }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
