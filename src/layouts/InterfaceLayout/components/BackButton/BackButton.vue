<template>
  <div class="back-container">
    <div class="content-title" @click.prevent="back">
      <div class="back-icon-container">
        <i class="fa fa-arrow-left" aria-hidden="true" />
      </div>
      <p>{{ $t('common.back') }}</p>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  methods: {
    back() {
      const path = this.$route.path.split('/');
      const goToPath = path.slice(0, path.length - 1).join('/');
      this.$router.push(goToPath);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BackButton.scss';
</style>
