<template functional>
  <div ref="tagContainer" class="tag-container">
    {{ props.name }}
    <span @click="props.deleteFunc(props.idx)"><i class="fa fa-times" /></span>
  </div>
</template>

<script>
export default {
  props: {
    deleteFunc: {
      type: Function,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    },
    idx: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'TagComponent.scss';
</style>
