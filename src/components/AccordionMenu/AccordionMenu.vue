<template>
  <div class="accordion-menu">
    <div :class="open ? 'open' : ''" class="accordion-header">
      <div class="accordion-number">{{ number }}</div>
      <div class="accordion-title">{{ title }}</div>
      <div class="edit-button">Edit</div>
    </div>
    <div :class="open ? 'open' : ''" class="accordion-content-container">
      <div class="content"><slot /></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccordionMenu',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    number: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  watch: {
    open(newVal) {
      return newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AccordionMenu.scss';
</style>
