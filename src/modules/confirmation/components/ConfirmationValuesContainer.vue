<template>
  <v-container class="position--relative pa-0">
    <div
      :class="[
        $vuetify.breakpoint.smAndUp ? 'swap-icon-sm-and-up' : 'swap-icon-xs',
        'swap-icon'
      ]"
    >
      <img
        :src="swapIcon"
        :class="[$vuetify.breakpoint.smAndUp ? '' : 'xs-svg', 'pa-1']"
        width="30px"
        contain
      />
    </div>
    <v-row v-if="isSwap" no-gutters>
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        sm="6"
        :class="!isEven(index) && $vuetify.breakpoint.smAndUp ? 'pl-1' : 'pb-1'"
      >
        <div class="value-container text-center py-6">
          <div class="mew-caption searchText--text pb-2">
            {{ item.title }}
          </div>
          <mew-token-container :icon="item.icon" size="medium" />
          <div class="mew-heading-4 font-weight-medium black--text pt-2">
            {{ item.value }}
            <span class="mew-body font-weight-medium"> {{ item.type }} </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import SwapIcon from '@/assets/images/icons/swap-arrow.svg';
export default {
  props: {
    items: {
      default: function () {
        return [];
      },
      type: Array
    },
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({ swapIcon: SwapIcon }),
  methods: {
    isEven(_value) {
      return _value % 2 == 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.value-container {
  border-radius: 5px;
  background-color: #f9f9f9;
}
.swap-icon {
  position: absolute;

  background-color: white;
  height: 30px;
  width: 30px;
  border-radius: 50%;
}
.swap-icon-sm-and-up {
  left: 48%;
  top: 42%;
}
.swap-icon-xs {
  left: 45%;
  top: 44%;
}
.xs-svg {
  transform: rotate(90deg);
}
</style>
