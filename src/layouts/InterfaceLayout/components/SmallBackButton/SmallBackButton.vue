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
      //const path = this.$route.path.split('/');
      //const goToPath = path.slice(0, path.length - 1).join('/');
      this.$router.push('/interface/nft-manager');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SmallBackButton.scss';
</style>
