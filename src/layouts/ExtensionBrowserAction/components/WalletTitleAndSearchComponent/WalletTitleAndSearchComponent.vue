<template>
  <div class="all-wallets-header">
    <h2>
      {{ title }}
    </h2>
    <div class="search-container">
      <i class="fa fa-search" />
      <input
        v-model="search"
        class="address-search"
        placeholder="Search for name or address"
      />
      <i v-show="search !== ''" class="fa fa-times" @click="clearSearch" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: ''
    };
  },
  watch: {
    search(newVal) {
      this.$emit('search', newVal);
    }
  },
  methods: {
    clearSearch() {
      this.search = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletTitleAndSearchComponent.scss';
</style>
