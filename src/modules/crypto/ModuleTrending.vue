<template>
  <!-- Top: Trending -->
  <header class="rounded-2xl p-4 bg-white shadow-md">
    <h2 class="text-s-20 mb-3">Trending Tokens</h2>
    <div class="flex justify-start flex-wrap">
      <div
        v-for="token in trendingTokens"
        :key="token.symbol"
        class="bg-grey-5 shadow-md rounded-full p-2 mt-2 mr-1 flex gap-2 items-center justify-around"
        :class="{ 'animate-pulse': false }"
      >
        <div class="flex gap-1 items-center">
          <img :src="token.icon" class="w-6 h-6 rounded-full" alt="" />
          <span class="text-s-14">{{ token.symbol }}</span>
        </div>
        <div class="flex items-center">
          <span
            class="text-s-12"
            :class="{
              'text-error': token.price_change_percentage_24hf < 0,
              'text-success': token.price_change_percentage_24hf >= 0,
            }"
            >{{ token.price_change_percentage_24hf }}%</span
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const trendingTokens = [
  {
    symbol: 'ETH',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: 6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=E',
  },
  {
    symbol: 'BTC',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: 6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=B',
  },
  {
    symbol: 'ONDO',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=O',
  },
  {
    symbol: 'SOL',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=S',
  },
  {
    symbol: 'MATIC',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=M',
  },
  {
    symbol: 'USDC',
    price_change_percentage_24h: 5.32,
    price_change_percentage_24hf: -6.12,
    price: 3400,
    icon: 'https://dummyimage.com/32x32/ffd700/000&text=U',
  },
]
</script>
