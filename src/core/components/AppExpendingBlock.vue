<template>
  <div class="mew-component--app-expending-block">
    <!-- ================================================================ -->
    <!-- (Slot) Header -->
    <!-- ================================================================ -->
    <div class="cursor--pointer" @click="headerClicked">
      <slot name="header"></slot>
    </div>

    <!-- ================================================================ -->
    <!-- (Slot) Main content -->
    <!-- ================================================================ -->
    <div class="main-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppExpendingBlock',
  props: {
    /*
    typeNumber: {
      type: Number,
      default: 5
    }
    */
  },
  data() {
    return {};
  },
  methods: {
    headerClicked() {
      console.log('Clicked');
    }
  }
};
</script>

<style lang="scss" scoped></style>
