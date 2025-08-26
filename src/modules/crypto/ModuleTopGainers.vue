<template>
  <section class="rounded-2xl p-2 shadow-sm bg-white">
    <div class="flex justify-between items-center pb-2">
      <h2 class="text-s-18 font-bold">Top Gainers</h2>
      <p class="text-grey-30 text-s-12">24 hour</p>
    </div>
    <div class="gap-2 flex-column">
      <div
        v-for="(m, i) in bigMovers"
        :key="i"
        class="rounded-xl border border-2 px-2 mb-2 py-1 bg-white border-grey-light shadow-md relative flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <img :src="m.icon" class="w-6 h-6 rounded-full" alt="" />
          <div>
            <div class="font-semibold text-s-14">{{ m.symbol }}</div>
            <div
              class="text-grey-30 text-right text-s-12 max-w-[70px] overflow-hidden text-ellipsis text-nowrap"
            >
              {{ m.name }}
            </div>
          </div>
        </div>
        <div class="flex-column items-center gap-1">
          <div
            :class="[
              m.change.startsWith('-') ? 'text-error' : 'text-success',
              'text-s-14',
            ]"
          >
            {{ m.change }}
          </div>
          <div class="text-grey-30 text-right text-s-12">
            {{ m.price }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// TODO: replace with api types
interface BigMover {
  name: string
  symbol: string
  price: string
  change: string // e.g. "+2.3%" or "-1.1%"
  ago: string
  from: string
  icon: string
}

// TODO: Replace with api data
const bigMovers = ref<BigMover[]>([
  {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    price: '$1,156.95',
    change: '150.3%',
    ago: '23 minutes ago',
    from: 'in one hour',
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=B',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$1,156.95',
    change: '2.3%',
    ago: '23 minutes ago',
    from: 'in one day',
    icon: 'https://dummyimage.com/32x32/f7931a/000&text=B',
  },
  {
    name: 'Wrapped Bitcoin (Arb)',
    symbol: 'WBTC',
    price: '$1,156.95',
    change: '2.3%',
    ago: '23 minutes ago',
    from: 'in one hour',
    icon: 'https://dummyimage.com/32x32/cc9900/000&text=W',
  },
])
</script>
