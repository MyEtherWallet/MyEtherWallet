<template>
  <div class="back-container">
    <div class="content-title" @click.prevent="back">
      <div class="back-icon-container">
        <i class="fa fa-arrow-left" aria-hidden="true" />
      </div>
      <p>{{ $t('common.back') }}</p>
    </div>
    <div class="right-slot"><slot /></div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    path: {
      type: String,
      default: ''
    }
  },
  methods: {
    back() {
      const routePath = this.$route.path.split('/');
      const goToPath = routePath.slice(0, routePath.length - 1).join('/');
      if (this.path === '') {
        this.$router.push(goToPath);
      } else {
        this.$router.push(this.path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BackButton.scss';
</style>
