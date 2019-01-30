<template>
  <div class="accordion-menu-2">
    <div :class="isopen && 'opened'" class="wrap">
      <div class="menu-title" @click="titleClicked">
        <div class="title-number">
          <span>{{ number }}</span>
        </div>
        <div>{{ title }}</div>
      </div>
      <div class="menu-content-container">
        <div class="padding-block"><slot></slot></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    number: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    isopen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    titleClicked() {
      this.$emit('titleClicked');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccordionMenu2.scss';
</style>
