<template>
  <v-expansion-panel class="exp-panel" :class="active ? 'active' : ''">
    <v-expansion-panel-header color="notificationSwap">
      <v-card
        class="d-block d-sm-flex align-center"
        color="transparent"
        flat
        max-width="95%"
      >
        <div class="mr-6 d-flex align-center mb-2 mb-sm-0">
          <v-icon color="orange" large> mdi-circle-medium </v-icon>
          <blockie
            type="swap"
            :address="address"
            :size="8"
            :scale="16"
            width="40px"
            height="40px"
            class="mr-3"
          />
        </div>
        <div class="text-overflow--ellipsis pr-sm-2">
          <div class="d-flex align-center">
            <div class="mr-1">To:</div>
            <EllipsisBlock
              max-width="200px"
              class="monospace"
              :text="address"
            />
          </div>

          <div class="d-flex align-center">
            <div>{{ fromAmount }}</div>
            <v-icon color="titlePrimary" small class="mx-1"
              >mdi-arrow-right-bold</v-icon
            >
            <div>{{ toAmount }}</div>
          </div>
        </div>
        <div class="d-flex d-sm-block ml-sm-auto text-sm-right mt-2 mt-sm-0">
          <badge badge-type="swap" badge-title="SWAP" />
          <div class="mt-0 mt-sm-1 ml-2 ml-sm-0">{{ time }} ago</div>
        </div>
      </v-card>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="notificationSwap">
      <v-divider class="mb-4" />
      <v-card flat color="notificationSwap">
        <ul class="list-style-type--none">
          <li
            v-for="(d, key) in data"
            :key="key"
            class="d-block d-sm-flex align-start justify-space-between"
          >
            <div class="pr-2 font-weight-bold">{{ d.label }}</div>
            <EllipsisBlock
              v-if="d.ellipsis"
              max-width="200px"
              class="monospace text-sm-right"
              :class="d.color + '--text'"
              :text="d.value"
            />
            <div v-else class="text-sm-right" :class="d.color + '--text'">
              {{ d.value }}
            </div>
          </li>
        </ul>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Blockie from '../blockieWithCurrency/BlockieWithCurrency';
import EllipsisBlock from '@/components/ellipsisBlock/EllipsisBlock';

export default {
  components: {
    Blockie,
    EllipsisBlock
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    fromAmount: {
      type: String,
      default: ''
    },
    toAmount: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { isHovering: false };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
$border-size: 5px;

ul {
  padding-left: 0 !important;
  li {
    padding: 5px;
  }
}

.v-expansion-panel {
  margin-top: 7px !important;
}

.v-expansion-panel-content {
  border-radius: 0 0 $border-size $border-size;
}

.v-expansion-panel-header {
  border-radius: $border-size;
  padding-left: 10px;
  padding-right: 10px;
}

.v-expansion-panel-header--active {
  border-radius: $border-size $border-size 0 0;
}

.exp-panel {
  border: 1px solid transparent;
  border-radius: 5px;
  &.active {
    border: 1px solid var(--v-warning-darken1);
  }
}
</style>
