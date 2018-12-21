<template>
  <div class="accordion-menu-1">
    <div class="wrap">
      <div class="menu-title">
        <div class="title-number">
          <span>{{ number }}</span>
        </div>
        <div>{{ title }}</div>
      </div>
      <div :class="isopen && 'opened'" class="content-container">
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
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'AccordionMenu1.scss';
</style>
