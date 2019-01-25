<template>
  <div class="standard-dropdown">
    <div class="wrap">
      <div class="dropdown-button" @click="dropdownOpen">
        <p v-if="chosenValue !== ''">{{ chosenValue }}</p>
        <p v-if="chosenValue === ''" class="placeholder">{{ placeholder }}</p>
        <i aria-hidden="true" class="fa fa-angle-down"></i>
      </div>
      <div v-if="open">
        <div class="dropdown-search-container">
          <input v-model="search" :placeholder="$t('interface.search')" />
          <i class="fa fa-search" />
        </div>
        <ul class="dropdown-list">
          <li
            v-for="(entry, idx) in localOptions"
            :key="idx"
            @click="setSelected(entry)"
          >
            {{ displayName(entry) }}
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
    optionDisplayKey: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    optionValueKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chosenValue: '',
      open: false,
      search: '',
      localOptions: this.options
    };
  },
  computed: {},
  watch: {
    search(newVal) {
      if (newVal !== '') {
        this.localOptions = this.options.filter(curr => {
          if (
            this.displayName(curr)
              .toLowerCase()
              .includes(newVal.toLowerCase()) ||
            this.displayName(curr)
              .toLowerCase()
              .includes(newVal.toLowerCase())
          ) {
            return curr;
          }
        });
      } else {
        this.localOptions = [];
        this.options.forEach(curr => this.localOptions.push(curr));
      }
    }
  },
  methods: {
    dropdownOpen() {
      this.open = !this.open;
      this.$emit('opened', this.open);
    },
    setSelected(val) {
      this.chosenValue = this.displayName(val);
      this.$emit('selection', this.optionValue(val));
      this.dropdownOpen();
    },
    displayName(val) {
      if (this.optionDisplayKey !== '') {
        return val[this.optionDisplayKey];
      }
      return val;
    },
    optionValue(val) {
      if (this.optionValueKey !== '') {
        return val[this.optionValueKey];
      }
      return val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StandardDropdown.scss';
</style>
