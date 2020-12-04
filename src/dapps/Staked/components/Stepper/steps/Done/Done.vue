<template>
  <div class="d-flex confirmation-container">
    <i class="check-icon fa fa-check" aria-hidden="true" />
    <h2 class="title">{{ $t('confirmation.success') }}</h2>
    <span>{{ $t('dappsStaked.done-desc') }}</span>
    <div class="explorrer-container">
      <div></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    hash: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('main', ['network'])
  },
  mounted() {
    this.$emit('completed', true, { key: 'done', value: true });
  }
};
</script>

<style lang="scss" scoped>
@import 'Done.scss';
</style>
