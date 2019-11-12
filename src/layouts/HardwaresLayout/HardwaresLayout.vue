<template>
  <div class="hardware-layout">
    <div class="page-container">
      <div class="hardware-container">
        <div class="hardware-text">
          <h2>{{ $t('buyHardwareWallet.pageTitle') }}</h2>
          <p>
            {{ $t('buyHardwareWallet.pageSubTtile') }}
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
              <p class="starting-from">
                {{ $t('buyHardwareWallet.priceStartingFrom') }}
              </p>
              <div class="price-container">
                <span>{{ item.currency }}</span>
                <p>
                  {{ item.price }}
                </p>
              </div>
              <p class="item-description">
                {{ item.description }}
              </p>
              <a
                :href="item.href"
                class="more-info"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('buyHardwareWallet.moreInfo') }} >
              </a>
            </div>
            <div class="hardware-item-logo">
              <img
                :src="require(`@/assets/images/affiliates/${item.logo}.png`)"
                alt
              />
            </div>
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
