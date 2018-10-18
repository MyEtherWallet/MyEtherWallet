<template>
  <div
    class="back-container"
    @click.prevent="resetView('')">
    <div class="content-title">
      <div class="back-icon-container">
        <i
          class="fa fa-arrow-left"
          aria-hidden="true"/>
      </div>
      <p v-if="!options.titleText">{{ $t('common.back') }}</p>
      <p v-if="options.titleText">{{ options.titleText }}</p>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    resetView: {
      type: Function,
      default: function() {}
    },
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'BackButton.scss';
</style>
