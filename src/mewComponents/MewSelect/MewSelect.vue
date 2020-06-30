<template>
  <div>
    <v-select
      height="62"
      class="mew-select"
      color="basic"
      append-icon="mdi-chevron-down"
      :disabled="disabled"
      :items="items"
      item-text="name"
      item-value="value"
      :label="label"
      v-model="selectModel"
      return-object
      outlined
    >
      <template
        v-slot:selection="{ item }"
      >
        <div class="d-flex align-center justify-center">
          <img
            v-if="item.img"
            class="item-img"
            :src="item.img"
          >
          <span class="text-uppercase">{{ item.name ? item.name : item }} <span
            v-if="item.value"
            class="searchText--text text-capitalize"
          >- {{ item.value }}</span></span>
        </div>
      </template>
      <template v-slot:item="data">
        <img
          class="item-img"
          v-if="data.item.img"
          :src="data.item.img"
        >
        <span class="text-uppercase">{{ data.item.name ? data.item.name : data.item }} <span
          v-if="data.item.value"
          class="textSecondary--text text-capitalize"
        >- {{ data.item.value }}</span></span>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: 'MewSelect',
  props: {
    /**
     * Disables the select dropdown.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Can be an array of objects or array of strings. When using objects, will look for a text and value field.
     * Can also add an img attribute to the object to append an img to the value.
     * Example: { name: "Orange", value: "Orange", img: orangeImg }
     */
    items: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * Sets the select label
     */
    label: {
      type: String,
      default: ''
    },
    /**
     * Sets the select value
     */
    value: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      selectModel: null
    };
  },
  watch: {
    selectModel(newValue) {
      // eslint-disable-next-line no-console
      console.log('select value:', newValue);
    }
  },
  mounted() {
    this.selectModel = this.items[0];
  }
};
</script>

<style lang="scss">
.mew-select {
  &.v-text-field--enclosed .v-input__append-inner {
    height: 100%;
    margin-top: 0;

    .v-input__icon {
      height: 100%;
    }
  }

  .item-img {
    margin-right: 5px;
    max-height: 25px;
  }
}
</style>
