<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="bg_notification_out">
      <v-card class="d-flex align-center pr-3" color="transparent" flat>
        <div class="mr-6">
          <blockie
            address="0xabc23787066c571a61274929746895c24fa9dbfc"
            :size="8"
            :scale="16"
            width="40px"
            height="40px"
          />
        </div>
        <div>
          <div>
            To: 0xabc23787066c571a61274929746895c24fa9dbfc
          </div>
          <div>
            Abount: 0.000234
            <span class="text-uppercase">
              ETH
            </span>
          </div>
        </div>
        <div class="ml-auto text-right">
          <v-chip
            class="text-uppercase white--text font-weight-bold"
            x-small
            label
            color="bg_notification_button_out"
          >
            OUT
          </v-chip>
          <div>1 min ago</div>
        </div>
      </v-card>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="bg_notification_out">
      <v-divider class="mb-4" />
      <v-card flat color="bg_notification_out">
        <ul class="list-style-type--none">
          <li>
            <div flat>Transaction hash:</div>
            <v-card max-width="300px" color="transparent" flat>
              <EllipsisBlock>
                0xc06cdcc936536224054723679ba8ff616b1a5f1cac8cfa606ee03488bfb82ef0
              </EllipsisBlock>
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
import Blockie from '@/web/components/BlockieWithCurrency';
import EllipsisBlock from '@/components/EllipsisBlock';

export default {
  components: {
    Blockie,
    EllipsisBlock
  },
  data() {
    return { isHovering: false };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
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
  border-radius: 0 0 5px 5px;
}

.v-expansion-panel-header {
  border-radius: 5px;
}

.v-expansion-panel-header--active {
  border-radius: 5px 5px 0 0;
}
</style>
