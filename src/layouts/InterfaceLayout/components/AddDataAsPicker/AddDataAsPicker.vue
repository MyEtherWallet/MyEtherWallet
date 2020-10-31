<template lang="html">
  <div v-click-outside="openDropdown" class="add-data-as-picker-container">
    <div>
      <div
        :class="[
          open ? 'open' : '',
          'dropdown-container',
          'dropdown-text-container'
        ]"
        @click="openDropdown"
      >
        <p>
          {{ $t('sendTx.add-data-as.' + selected) }}
        </p>
        <i :class="['fa', open ? 'fa-angle-up' : 'fa-angle-down']" />
      </div>
      <div :class="[open ? 'open' : 'hide', 'dropdown-item-container']">
        <div class="item-container">
          <div
            v-for="curr in ['original', 'utf-8']"
            :key="curr"
            :class="[curr === selected ? 'selected' : '', 'item']"
            @click="select(curr)"
          >
            <p>{{ $t('sendTx.add-data-as.' + curr) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: 'original',
      open: false
    };
  },
  watch: {
    selected(newVal) {
      this.$emit('selected', newVal);
    }
  },
  methods: {
    openDropdown() {
      this.open = !this.open;
    },
    select(selected) {
      this.openDropdown();
      this.selected = selected;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddDataAsPicker.scss';
</style>
