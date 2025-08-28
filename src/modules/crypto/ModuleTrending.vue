<template>
  <!-- Top: Trending -->
  <div>
    <h2 class="text-s-20 mb-3">Trending Tokens</h2>
    <div class="flex justify-start gap-3 flex-wrap">
      <div
        v-for="token in trendingTokens"
        :key="token.symbol"
        class="bg-grey-5 w-[115px] h-[100px] shadow-md gap-2 p-4 mt-2 mr-1 flex flex-col bg-white rounded-2xl"
      >
        <div class="flex gap-1 items-center justify-between">
          <img :src="token.icon" class="w-6 h-6 rounded-full" alt="" />
          <span
            class="text-s-18"
            :class="{
              'text-error': token.price_change_percentage_24hf < 0,
              'text-success': token.price_change_percentage_24hf >= 0,
            }"
            >{{ token.price_change_percentage_24hf }}%</span
          >
        </div>
        <div class="flex flex-col">
          <span class="text-s-18">{{ token.symbol }}</span>
          <span class="text-s-14 text-grey-30">{{ token.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const trendingTokens = [
  {
    symbol: 'ETH',
    name: 'ETH',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: 6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=E',
  },
  {
    symbol: 'BTC',
    name: 'BTC',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: 6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=B',
  },
  {
    symbol: 'ONDO',
    name: 'ONDO',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=O',
  },
  {
    symbol: 'SOL',
    name: 'SOL',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=S',
  },
  {
    symbol: 'MATIC',
    name: 'MATIC',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=M',
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=U',
  },
]
</script>
