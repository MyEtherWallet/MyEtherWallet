<template>
  <div class="hardware-layout">
    <div class="page-container">
      <div class="hardware-container">
        <div class="hardware-text">
          <h2>{{ $t('buyHardwareWallet.page.title') }}</h2>
        </div>
        <div class="hardware-items-container">
          <div
            v-for="item in items"
            v-show="item.price !== ''"
            :key="item.text"
            class="hardware-item"
          >
            <div class="hardware-item-text">
              <p class="starting-from">
                {{ $t('buyHardwareWallet.caption-starting-from') }}
              </p>
              <div class="price-container">
                <span>{{ item.currency }}</span>
                <p>{{ item.price }}</p>
              </div>
              <p class="item-description">
                {{ getItemDesc(item.description) }}
              </p>
              <a
                :href="item.href"
                class="more-info"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('buyHardwareWallet.button-more-info') }}
              </a>
            </div>
            <div class="hardware-item-logo">
              <img :src="getImg(item.logo)" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import affiliates from '@/containers/FooterContainer/affiliates';
import defaultHardware from '@/assets/images/icons/button-hardware.svg';

export default {
  data() {
    return {
      items: affiliates
    };
  },
  methods: {
    getItemDesc(desc) {
      return `${this.$t(desc)}`;
    },
    getImg(logo) {
      try {
        const foundLogo = require(`@/assets/images/affiliates/${logo}.png`);
        return foundLogo;
      } catch (e) {
        return defaultHardware;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HardwaresLayout.scss';
</style>
