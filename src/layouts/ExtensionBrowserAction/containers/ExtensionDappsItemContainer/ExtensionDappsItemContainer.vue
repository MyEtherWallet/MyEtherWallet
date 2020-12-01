<template>
  <div class="dapps-item-container">
    <div class="dapp-item-container">
      <div v-for="dapp in filteredArr" :key="dapp.slug" class="dapp-item">
        <img :src="dapp.iconUrl" />
        <div class="dapp-text">
          <h3>{{ dapp.name }}</h3>
          <p>{{ dapp.teaser }}</p>
        </div>
        <router-link :to="`dapps/${dapp.slug}`" class="view-button" tag="div">
          {{ $t('mewcx.view-more') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dapps: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filteredArr() {
      return this.dapps;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionDappsItemContainer.scss';
</style>
