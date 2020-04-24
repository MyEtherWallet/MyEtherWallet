<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="bg_color_gray">
      <v-card class="d-flex align-center" color="transparent" flat>
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
      </v-card>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="bg_color_gray">
      <DividerLine />
      <v-card
        color="transparent"
        flat
        class="d-flex align-center justify-space-between pt-4 px-1"
      >
        <div color="transparent" flat>Transaction hash:</div>
        <v-card max-width="300px" color="transparent" flat>
          <EllipsisBlock>
            0xc06cdcc936536224054723679ba8ff616b1a5f1cac8cfa606ee03488bfb82ef0
          </EllipsisBlock>
        </v-card>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Blockie from '@/web/components/Blockie';
import EllipsisBlock from '@/components/EllipsisBlock';
import DividerLine from '@/web/components/Common/DividerLine';

export default {
  components: {
    Blockie,
    EllipsisBlock,
    DividerLine
  },
  data() {
    return { isHovering: false };
  },
  methods: {}
};
</script>
