<template>
  <div class="dropdown-unit-selector">
    <div class="unit-selector-click-safe-zone">
      <div
        :class="dropdownOpen ? 'dropdown-open' : ''"
        class="dropdown-input-box"
        @click="dropdownOpen = !dropdownOpen"
      >
        <div class="selected-unit">{{ currentSelected | capitalize }}</div>
        <div class="dropdown-open-button">
          <i
            v-if="!dropdownOpen"
            class="fa fa-chevron-down"
            aria-hidden="true"
          />
          <i v-if="dropdownOpen" class="fa fa-chevron-up" aria-hidden="true" />
        </div>
      </div>
      <div
        :class="dropdownOpen ? 'show-dropdown' : ''"
        class="dropdown-list-box"
      >
        <ul>
          <li
            v-for="(opt, idx) in options"
            :key="opt + idx"
            @click="selected(opt)"
          >
            {{ opt | capitalize }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    currentSelected: {
      type: String,
      default: ''
    },
    left: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropdownOpen: false
    };
  },
  beforeMount() {
    // Detect all clicks on the document
    document.addEventListener('click', this.clickEvent, false);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickEvent, false);
  },
  methods: {
    clickEvent: function(event) {
      const path =
        event.path ||
        (event.composedPath && event.composedPath()) ||
        this.composedPath(event.target);
      for (let count = 0; count < path.length; count++) {
        if (path[count].className === 'unit-selector-click-safe-zone') {
          return;
        }
      }
      this.dropdownOpen = false;
    },
    composedPath(el) {
      const path = [];

      while (el) {
        path.push(el);
        if (el.tagName === 'HTML') {
          path.push(document);
          path.push(window);
          return path;
        }
        el = el.parentElement;
      }
    },
    selected(val) {
      this.dropdownOpen = false;
      this.$emit('updateSelected', [val, this.left ? 'left' : 'right']);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownUnitSelector.scss';
</style>
