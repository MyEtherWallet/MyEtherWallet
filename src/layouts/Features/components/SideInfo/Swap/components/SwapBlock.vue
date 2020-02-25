<template>
  <div class="container">
    <div class="left-container">
      {{ amount }} {{ from.toUpperCase() }} / {{ rate }} {{ to.toUpperCase() }}
    </div>
    <div class="right-container">
      <img
        :src="require('@/assets/images/Icons/' + from + '.png')"
        alt="swap-icon"
      />
      <img
        class="swap-arrow"
        src="@/assets/images/Icons/swap-arrow.png"
        alt="swap-icon"
      />
      <img
        :src="require('@/assets/images/Icons/' + to + '.png')"
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
  background-color: $light-mint;
  border-radius: 4px;
  color: $dark-space;
  display: flex;
  justify-content: space-between;
  padding-left: 17px;
  padding-right: 17px;
}
</style>
