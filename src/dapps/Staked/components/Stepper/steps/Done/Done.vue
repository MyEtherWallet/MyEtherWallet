<template>
  <div class="d-flex confirmation-container">
    <i class="check-icon fa fa-check-circle-o" aria-hidden="true" />
    <h2 class="title">{{ $t('confirmation.success') }}</h2>
    <span>{{ $t('dappsStaked.done-desc') }}</span>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$emit('completed', { key: 'done', value: true });
  }
};
</script>

<style lang="scss" scoped>
@import 'Done.scss';
</style>
