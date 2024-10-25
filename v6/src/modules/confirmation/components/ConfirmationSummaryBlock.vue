<template>
  <div v-if="items.length > 0" class="my-5">
    <v-row
      v-for="(item, index) in items"
      :key="index"
      no-gutters
      class="mb-2 mb-sm-1 mt-0"
    >
      <v-col
        cols="12"
        sm="6"
        class="text-left mew-caption font-weight-medium greyPrimary--text"
      >
        {{ item }}
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <slot :name="`rightColItem${index}`" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    /**
     * Array of strings to be displayed in rows on the left.
     */
    items: {
      default: () => [],
      type: Array
    }
  }
};
</script>
