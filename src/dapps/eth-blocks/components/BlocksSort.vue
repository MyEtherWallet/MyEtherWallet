<template>
  <!--
  =====================================================================================
    Sort Component - Eth Blocks
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

<script setup>
import { ref } from 'vue';
import BlocksDropDown from './BlocksDropDown.vue';

// emits
const emits = defineEmits(['setSort']);

const SORT_VALUES = [
  { text: 'Newest', value: 0 },
  { text: 'Oldest', value: 1 },
  { text: 'Number: 0 to 9', value: 2 },
  { text: 'Number: 9 to 0', value: 3 }
];

const selectedSort = ref(SORT_VALUES[0]);

// methods
const setSelected = value => {
  selectedSort.value = value;
  emits('setSort', value.value);
};
</script>

<style lang="scss" scoped>
.activator-btn-text {
  letter-spacing: normal !important;
}
</style>
