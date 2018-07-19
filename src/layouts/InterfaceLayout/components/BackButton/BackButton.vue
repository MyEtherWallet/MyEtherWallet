<template>
  <div @click.prevent="resetView('')" class="back-container">
    <div class="content-title">
      <div class="back-icon-container">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
      <p>{{ $t('reused.back') }}</p>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: ['resetView'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  @import "BackButton.scss";
</style>
