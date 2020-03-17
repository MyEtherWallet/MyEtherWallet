<template>
  <div class="container" :class="theme">
    <div class="left-container">
      {{ amount }} {{ from.toUpperCase() }} / {{ rate }} {{ to.toUpperCase() }}
    </div>
    <div class="right-container">
      <img
        :src="require('@/assets/images/currencies/' + from + '.png')"
        alt="swap-icon"
      />
      <img
        class="swap-arrow mx-2"
        src="@/assets/images/icons/icon-swap-arrow-grey.png"
        alt="swap-icon"
      />
      <img
        :src="require('@/assets/images/currencies/' + to + '.png')"
        alt="swap-icon"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    to: { default: '', type: String },
    from: { default: '', type: String },
    rate: { default: '', type: String },
    amount: { default: '', type: String }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
.right-container {
  align-items: center;
  display: flex;
  .swap-arrow {
    height: 15px;
    width: 15px;
    margin-left: 5px;
    margin-right: 5px;
  }
  img {
    height: 24px;
    width: 24px;
  }
}
.container {
  align-items: center;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding-left: 17px;
  padding-right: 17px;

  &.light {
    background-color: $light-table-background-1;
  }

  &.dark {
    background-color: $dark-table-background-1;
  }
}
</style>
