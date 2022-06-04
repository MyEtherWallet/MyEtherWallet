<template>
  <div class="mew-menu-popup">
    <v-btn id="unique-id--mew-menu-popup-activator" @click="toggleMenu">
      {{ btnTitle }}
    </v-btn>

    <div
      id="unique-id--mew-menu-popup-content"
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
    btnTitle: {
      default: '',
      type: String
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
  mounted() {
    this.activate();
  },
  destroyed() {
    this.deactivate();
  },
  methods: {
    // Reposition popup content
    contentReposition() {
      const activatorPosition = this.activatorEl.getBoundingClientRect();
      this.contentEl.style.position = 'fixed';
      this.contentEl.style.top = activatorPosition.bottom + 10 + 'px';
      this.contentEl.style.left = activatorPosition.left + 'px';
    },
    // Append popup content to root
    contentAppend() {
      this.$root.$el.append(this.contentEl);
    },
    // Remove popup content from root
    contentRemove() {
      this.$root.$el.removeChild(this.contentEl);
    },
    activate() {
      window.addEventListener('resize', this.contentReposition);
      window.addEventListener('scroll', this.contentReposition);
      this.contentReposition();
      this.contentAppend();
    },
    deactivate() {
      window.removeEventListener('resize', this.contentReposition);
      window.removeEventListener('scroll', this.contentReposition);
      this.contentRemove();
    },
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
.mew-menu-popup-content {
  background-color: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 5px 5px -3px rgb(13 41 66 / 20%),
    0 8px 10px 1px rgb(13 41 66 / 14%), 0 3px 14px 2px rgb(13 41 66 / 12%);

  opacity: 1;
  transition: opacity 0.2s ease;
}

.content-fade-out {
  opacity: 0;
  pointer-events: none;
}
</style>
