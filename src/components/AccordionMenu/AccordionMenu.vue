<template>
  <div class="accordion-menu accordion-menu-2">
    <div :class="isopen && 'opened'" class="wrap">
      <div
        :class="greytitle ? 'grey-title' : ''"
        class="menu-title"
        @click="titleClicked"
      >
        <div class="title-number">
          <span>{{ number }}</span>
        </div>
        <div>{{ title }}</div>
        <div v-if="rightText !== ''" class="edit-button">{{ rightText }}</div>
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
    greytitle: {
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
    isopen: {
      type: Boolean,
      default: false
    },
    editbutton: {
      type: Boolean,
      default: false
    },
    rightText: {
      type: String,
      default: ''
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
@import 'AccordionMenu.scss';
</style>
