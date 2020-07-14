<template>
  <div>
    <v-tabs
      v-model="onTab"
      :class="[isBlock ? 'mew-tabs-block elevation-2' : '']"
      background-color="transparent"
      color="titlePrimary"
      slider-size="3"
      :hide-slider="isBlock"
      :grow="isBlock"
    >
      <v-tab
        v-for="(item, i) in items"
        :key="item + i"
        :class="[isBlock ? 'mew-tab-block' : 'mew-heading-2', 'capitalize']"
      >
        {{ item.name }}
      </v-tab>
      <v-tabs-items v-model="onTab">
        <v-tab-item v-for="(item, i) in items" :key="item + i">
          <v-slide-x-reverse-transition :hide-on-leave="true" mode="out-in">
            <slot :name="'tabItemContent' + i" />
          </v-slide-x-reverse-transition>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <div v-for="(item, i) in items" :key="item + i">
      <v-slide-x-reverse-transition :hide-on-leave="true" mode="out-in">
        <slot v-if="onTab === i" :name="'tabContent' + i" />
      </v-slide-x-reverse-transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MewTabs',
  props: {
    /**
     * Tab content
     */
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    /**
     * Shows the tab as a block.
     */
    isBlock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onTab: null
    };
  },
  watch: {
    onTab(newVal) {
      this.$emit('onTab', newVal);
    }
  },
  methods: {
    onClick() {
      this.$emit('onNextStep');
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-tabs-block {
  border-radius: 12px !important;

  .mew-tab-block {
    background-color: var(--v-white-base);
    color: var(--v-basic-base) !important;
  }

  .v-tab--active {
    background: var(--v-basic-base);
    color: var(--v-white-base) !important;
  }

  .mew-tab-block:first-of-type {
    border-radius: 12px 0px 0px 12px;
  }

  .mew-tab-block:last-of-type {
    border-radius: 0px 12px 12px 0px;
  }
}
</style>
