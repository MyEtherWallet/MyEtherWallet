<template>
  <div class="mew-menu-popup">
    <!-- ================================================================== -->
    <!-- Activator slot -->
    <!-- ================================================================== -->
    <div
      id="unique-id--mew-menu-popup-activator"
      class="mew-menu-popup-activator"
      style="display: inline-block"
      @click.stop="toggleMenu"
    >
      <slot name="activator"></slot>
    </div>

    <!-- ================================================================== -->
    <!-- Content slot -->
    <!-- ================================================================== -->
    <div
      id="unique-id--mew-menu-popup-content"
      :style="`top: ${spacing}`"
      class="mew-menu-popup-content"
      :class="show ? '' : 'content-fade-out'"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // Space between activator and content
    spacing: {
      type: String,
      default: '50px'
    }
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    activatorEl() {
      return document.querySelector('#unique-id--mew-menu-popup-activator');
    },
    contentEl() {
      return document.querySelector('#unique-id--mew-menu-popup-content');
    }
  },
  methods: {
    detactOutsideClick(e) {
      const targetEl = e.target;
      if (
        !(
          targetEl == this.contentEl ||
          targetEl == this.activatorEl ||
          this.contentEl.contains(targetEl) ||
          this.activatorEl.contains(targetEl)
        )
      ) {
        this.show = false;
        window.removeEventListener('click', this.detactOutsideClick);
      }
    },
    toggleMenu() {
      this.show = !this.show;
      if (this.show) {
        window.addEventListener('click', this.detactOutsideClick);
      } else {
        window.removeEventListener('click', this.detactOutsideClick);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// ======================================================================
// Setup main container
// ======================================================================
.mew-menu-popup {
  position: relative;
  display: inline-block;
}

// ======================================================================
// Setup activator container
// ======================================================================
.mew-menu-popup-activator {
  cursor: pointer;
  user-select: none;
}

// ======================================================================
// Setup content container
// ======================================================================
.mew-menu-popup-content {
  background-color: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 5px 5px -3px rgb(13 41 66 / 20%),
    0 8px 10px 1px rgb(13 41 66 / 14%), 0 3px 14px 2px rgb(13 41 66 / 12%);
  opacity: 1;
  transition: opacity 0.25s ease;
  position: absolute;
  z-index: 999;
  top: 0;
  right: 0;
}

// ======================================================================
// Setup content block fade in/out animation
// ======================================================================
.content-fade-out {
  opacity: 0;
  pointer-events: none;
}
</style>
