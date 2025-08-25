<template>
  <section>
    <h2 class="pb-2 text-s-24">Recent Big Movers</h2>
    <div class="gap-2 flex-column">
      <div
        v-for="(m, i) in bigMovers"
        :key="i"
        class="rounded-xl border border-2 px-2 mb-2 py-1 bg-white border-grey-light shadow-md relative flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <img :src="m.icon" class="w-6 h-6 rounded-full" alt="" />
          <div>
            <div class="text-grey-30">{{ m.symbol }}</div>
            <div class="font-semibold text-right">
              {{ m.price }}
            </div>
          </div>
        </div>
        <div class="mt-1 text-s-11 flex items-center gap-1 text-grey-30">
          <div
            :class="[
              m.change.startsWith('-') ? 'text-error' : 'text-success',
              'text-s-17',
            ]"
          >
            {{ m.change }}
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
    change: '-2.3%',
    ago: '23 minutes ago',
    from: 'in one hour',
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=B',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$1,156.95',
    change: '-2.3%',
    ago: '23 minutes ago',
    from: 'in one day',
    icon: 'https://dummyimage.com/32x32/f7931a/000&text=B',
  },
  {
    name: 'Wrapped Bitcoin (Arb)',
    symbol: 'WBTC',
    price: '$1,156.95',
    change: '-2.3%',
    ago: '23 minutes ago',
    from: 'in one hour',
    icon: 'https://dummyimage.com/32x32/cc9900/000&text=W',
  },
])
</script>
