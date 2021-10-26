<template>
  <!--
=====================================================================================
 Derivation Path Component - Access Wallet
=====================================================================================
-->
  <blocks-drop-down :has-close="false" has-icon>
    <template #activatorBtnText>
      <div class="titleMedium--text mew-body activator-btn-text d-flex">
        {{ selectedSort.text }}
      </div>
    </template>
    <template #cardContent>
      <v-list v-for="item in sort" :key="item.value" class="py-0">
        <v-list-item class="cursor-pointer" @click="setSelected(item)">
          <v-list-item-title
            class="mew-body basic--text subItem d-flex align-center pt-"
          >
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </blocks-drop-down>
</template>

<script>
import BlocksDropDown from './BlocksDropDown.vue';

const SORT_VALUES = [
  { text: 'Newest', value: 0 },
  { text: 'Oldest', value: 1 },
  { text: 'Number: 0 to 9', value: 2 },
  { text: 'Number: 9 to 0', value: 3 }
];
export default {
  name: 'BlocksSort',
  components: {
    BlocksDropDown
  },
  props: {},
  data() {
    return {
      sort: SORT_VALUES,
      selectedSort: SORT_VALUES[0]
    };
  },
  computed: {},
  methods: {
    /**
     * Emits the path value and name back to parent
     * then closes dropdown
     */
    setSelected(value) {
      this.selectedSort = value;
      this.$emit('setSort', value.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.activator-btn-text {
  letter-spacing: normal !important;
}
</style>
