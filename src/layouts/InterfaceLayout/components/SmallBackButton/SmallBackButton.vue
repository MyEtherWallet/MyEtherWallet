<template>
  <div class="small-back-button">
    <p @click.prevent="back">&#60; {{ $t('common.back') }}</p>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    back() {
      this.$router.push('/interface/nft-manager', () => {}, () => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SmallBackButton.scss';
</style>
