<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="bg_color_gray">
      <div class="d-flex align-center">
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
            From: 0xabc23787066c571a61274929746895c24fa9dbfc
          </div>
          <div>
            Abount: 0.000234
            <span class="text-uppercase">
              ETH
            </span>
          </div>
        </div>
        <div class="ml-auto">
          <div class="text-uppercase">
            IN
          </div>
          <div>1 min ago</div>
        </div>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="bg_color_gray">
      <div class="data-table d-flex align-center justify-space-between">
        <div>Transaction hash:</div>
        <EllipsisBlock>
          0xc06cdcc936536224054723679ba8ff616b1a5f1cac8cfa606ee03488bfb82ef0
        </EllipsisBlock>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Blockie from '@/web/components/Blockie';
import EllipsisBlock from '@/components/EllipsisBlock';

export default {
  components: {
    Blockie,
    EllipsisBlock
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.data-table {
  > div:nth-child(2) {
    max-width: 300px;
  }
}
</style>
