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
      for (let count = 0; count < event.path.length; count++) {
        if (event.path[count].className === 'unit-selector-click-safe-zone') {
          return;
        }
      }
      this.dropdownOpen = false;
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
