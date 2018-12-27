<template>
  <div class="standard-dropdown">
    <div class="wrap">
      <div class="dropdown-button" @click="dropdownOpen = !dropdownOpen">
        <p>{{ chosenValue }}</p>
        <i aria-hidden="true" class="fa fa-angle-down"></i>
      </div>
      <div v-if="dropdownOpen" class="dropdown-list">
        <ul>
          <li value="CA" @click="listClicked($event)">CA</li>
          <li>CA</li>
          <li>CA</li>
          <li>CA</li>
          <li>CA</li>
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
      chosenValue: 'CA',
      dropdownOpen: false
    };
  },
  computed: {},
  methods: {
    listClicked(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardDropdown.scss';
</style>
