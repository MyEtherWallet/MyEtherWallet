<template>
  <div class="dropdown-unit-selector">

    <div class="unit-selector-click-safe-zone">
      <div
        :class="dropdownOpen ? 'dropdown-open' : ''"
        class="dropdown-input-box"
        @click="dropdownOpen = !dropdownOpen">
        
        <div class="selected-unit">
          Wei
        </div>
        <div
          class="dropdown-open-button">
          <i
            v-if="!dropdownOpen"
            class="fa fa-chevron-down"
            aria-hidden="true"/>
          <i
            v-if="dropdownOpen"
            class="fa fa-chevron-up"
            aria-hidden="true"/>
        </div>
      </div>
      <div
        :class="dropdownOpen ? 'show-dropdown' : ''"
        class="dropdown-list-box">

        <ul>
          <li>Wei</li>
          <li>Kwei</li>
          <li>Mwei</li>
          <li>Gwei</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      dropdownOpen: false,
      units: [
        { name: 'Wei' },
        { name: 'Kwei' },
        { name: 'Mwei' },
        { name: 'Gwei' }
      ]
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DropDownUnitSelector.scss';
</style>
