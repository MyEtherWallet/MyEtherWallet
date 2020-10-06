<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="superPrimary">
      <v-card class="d-flex align-center pr-3" color="transparent" flat>
        <div class="mr-6 d-flex align-center">
          <v-icon color="primary" large>mdi-circle-medium</v-icon>
          <blockie
            address="0xabc23787066c571a61274929746895c24fa9dbfc"
            :size="8"
            :scale="16"
            width="40px"
            height="40px"
          />
        </div>
        <div>
          <EllipsisBlock
            max-width="200px"
            class="monospace"
            text="From: 0xabc23787066c571a61274929746895c24fa9dbfc"
          />
          <div>
            Abount: 0.000234
            <span class="text-uppercase"> ETH </span>
          </div>
        </div>
        <div class="ml-auto text-right">
          <badge badge-type="txIn" badge-title="IN" />
          <div>1 min ago</div>
        </div>
      </v-card>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="superPrimary">
      <v-divider class="mb-4" />
      <v-card flat color="superPrimary">
        <ul class="list-style-type--none">
          <li>
            <div flat>Transaction hash:</div>
            <v-card max-width="300px" color="transparent" flat>
              <EllipsisBlock
                max-width="200px"
                class="monospace"
                text="0xabc23787066c571a61274929746895c24fa9dbfc"
              />
            </v-card>
          </li>
          <li>
            <div>Gas price:</div>
            <div>41 Gwei</div>
          </li>
          <li>
            <div>Gas limit:</div>
            <div>400000</div>
          </li>
          <li>
            <div>Max transaction fee:</div>
            <div>0.0002342 ETH ($0.09)</div>
          </li>
          <li>
            <div>Nonce:</div>
            <div>2534</div>
          </li>
          <li>
            <div>Time:</div>
            <div>13:22:22</div>
          </li>
          <li>
            <div>Status:</div>
            <div>Succeed</div>
          </li>
          <li>
            <div>Error message:</div>
            <div>None</div>
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
    amount: {
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
