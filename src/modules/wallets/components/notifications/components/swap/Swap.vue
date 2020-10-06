<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="warning">
      <v-card class="d-flex align-center pr-3" color="transparent" flat>
        <div class="mr-6 d-flex align-center">
          <v-icon color="orange" large>mdi-circle-medium</v-icon>
          <blockie
            :address="address"
            :size="8"
            :scale="16"
            width="40px"
            height="40px"
          />
        </div>
        <div>
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
            <v-icon>mdi-arrow-right-bold</v-icon>
            <div>{{ toAmount }}</div>
          </div>
        </div>
        <div class="ml-auto text-right">
          <badge badge-type="swap" badge-title="SWAP" />
          <div>{{ time }} ago</div>
        </div>
      </v-card>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="warning">
      <v-divider class="mb-4" />
      <v-card flat color="warning">
        <ul class="list-style-type--none">
          <li v-for="(d, key) in data" :key="key">
            <div>{{ d.label }}</div>
            <EllipsisBlock
              v-if="d.ellipsis"
              max-width="200px"
              class="monospace"
              :class="d.color + '--text'"
              :text="d.value"
            />
            <div v-else :class="d.color + '--text'">{{ d.value }}</div>
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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
</style>
