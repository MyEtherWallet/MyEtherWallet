<template>
  <div class="hardware-layout">
    <div class="hardware-container">
      <div class="hardware-text">
        <h2>Buy a Hardware wallet</h2>
        <p>
          Purchase a hardware wallet for the highest security when accessing
          your crypto.
        </p>
      </div>
      <div class="hardware-items-container">
        <div
          v-for="item in items"
          v-if="item.logo !== ''"
          :key="item.text"
          class="hardware-item"
        >
          <div class="hardware-item-text">
            <p class="starting-from">Starting From</p>
            <div class="price-container">
              <p>
                <span>{{ item.currency }}</span>
                {{ item.price }}
              </p>
            </div>
            <p class="item-description">
              {{ item.description }}
            </p>
            <a :href="item.href" target="_blank" rel="noopener noreferrer">
              See More >
            </a>
          </div>
          <div class="hardware-item-logo">
            <img
              :src="require(`@/assets/images/affiliates/${item.logo}.jpg`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import affiliates from '@/containers/FooterContainer/affiliates';

export default {
  data() {
    return {
      items: affiliates
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'HardwaresLayout.scss';
</style>
