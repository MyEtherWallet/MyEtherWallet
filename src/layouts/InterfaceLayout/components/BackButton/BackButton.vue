<template>
  <div :class="['back-container', hideBorder ? '' : 'bottom-border']">
    <div class="content-title" @click.prevent="back">
      <div class="back-icon-container">
        <i class="fa fa-arrow-left" aria-hidden="true" />
      </div>
      <p v-if="!title">{{ $t('common.back') }}</p>
      <p v-if="title">{{ title }}</p>
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
    },
    title: {
      type: String,
      default: ''
    },
    hideBorder: {
      type: Boolean,
      default: false
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
