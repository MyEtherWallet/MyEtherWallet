<template>
  <div
    class="mew-component--app-expending-block"
    :class="btnBottom ? 'd-flex flex-column-reverse' : ''"
  >
    <!-- ================================================================ -->
    <!-- (Slot) (Clickable) Header -->
    <!-- ================================================================ -->
    <div
      :class="[
        btnLeft ? 'd-flex justify-start' : '',
        btnRight ? 'd-flex justify-end' : ''
      ]"
    >
      <!-- ========================================= -->
      <!--  <template #header> -->
      <!-- ========================================= -->
      <div class="cursor--pointer user-select--none" @click="headerClicked">
        <slot name="header" />
      </div>

      <!-- ========================================= -->
      <!--  <template #headerShow> -->
      <!-- ========================================= -->
      <div
        v-show="!isExpended"
        class="cursor--pointer user-select--none"
        @click="headerClicked"
      >
        <slot name="headerShow" />
      </div>

      <!-- ========================================= -->
      <!--  <template #headerHide> -->
      <!-- ========================================= -->
      <div
        v-show="isExpended"
        class="cursor--pointer user-select--none"
        @click="headerClicked"
      >
        <slot name="headerHide" />
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- (Slot) Main content -->
    <!-- ================================================================ -->
    <div
      ref="mainContent"
      class="main-content"
      :class="isExpended ? 'expending-block--active' : ''"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppExpendingBlock',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    expend: {
      type: Boolean,
      default: false
    },
    btnRight: {
      type: Boolean,
      default: false
    },
    btnLeft: {
      type: Boolean,
      default: false
    },
    btnBottom: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isExpended: false
    };
  },

  watch: {
    value(newVal) {
      // Expend when block is already closed to prevent infinite Loop
      if (newVal === true && this.isExpended === false) {
        this.expendBlock();
      }
      // Collapse when block is already open to prevent infinite Loop
      if (newVal === false && this.isExpended === true) {
        this.collapseBlock();
      }
    },
    expend(newVal) {
      // Expend when block is already closed to prevent infinite Loop
      if (newVal === true && this.isExpended === false) {
        this.expendBlock();
      }
      // Collapse when block is already open to prevent infinite Loop
      if (newVal === false && this.isExpended === true) {
        this.collapseBlock();
      }
    }
  },

  mounted() {
    // Wait for contents in the [.main-content]
    // then apply initial v-model value or expend value
    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }
    delay(100).then(() => {
      if (this.value || this.expend) this.expendBlock();
    });
  },

  methods: {
    headerClicked() {
      if (this.isExpended) this.collapseBlock();
      else this.expendBlock();
    },
    // Open
    expendBlock() {
      this.$refs.mainContent.style.maxHeight =
        this.$refs.mainContent.scrollHeight + 'px';

      this.isExpended = true;

      // Emit v-model
      this.$emit('input', true);
    },
    // Close
    collapseBlock() {
      this.$refs.mainContent.style.maxHeight = '0px';

      this.isExpended = false;

      // Emit v-model
      this.$emit('input', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  opacity: 0;
  max-height: 0;
  transition: max-height 0.25s ease, opacity 0.3s ease-in 0.14s;
  overflow: hidden;
  border: 0;
}

.expending-block--active {
  opacity: 1;
}
</style>
