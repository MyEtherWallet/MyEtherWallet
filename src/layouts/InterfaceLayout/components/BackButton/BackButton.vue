<template>
  <div
    class="back-container"
    @click.prevent="back">
    <div class="content-title">
      <div class="back-icon-container">
        <i
          class="fa fa-arrow-left"
          aria-hidden="true"/>
      </div>
      <p>{{ $t('common.back') }}</p>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BackButton.scss';
</style>
