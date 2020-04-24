<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <div class="overlay-content">
      <OverlayTitle title="Notifications" />
      <WhiteSheet>
        <div class="pa-4">
          <div>
            <div class="text-center font-weight-bold">1/8/2020</div>
            <v-expansion-panels light hover flat>
              <v-expansion-panel>
                <v-expansion-panel-header color="red">
                  <div class="d-flex align-center">
                    <div class="mr-6">
                      <blockie
                        address="0xc2a933600c3fe776777b4000665409c61493d417"
                        :size="8"
                        :scale="16"
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div>
                      <div>From: 0x92349857934875</div>
                      <div>Abount: 0.0000123 ETH</div>
                    </div>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content color="red">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header color="blue"
                  >Item</v-expansion-panel-header
                >
                <v-expansion-panel-content color="blue">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header color="#f2fafa"
                  >Item</v-expansion-panel-header
                >
                <v-expansion-panel-content color="#f2fafa">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </WhiteSheet>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import Blockie from '@/web/components/Blockie';

export default {
  components: {
    Blockie,
    BaseOverlay,
    OverlayTitle,
    WhiteSheet
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      notifications: [
        {
          txType: 'in',
          address: '0xabc23787066c571a61274929746895c24fa9dbfc',
          amount: '0.000243',
          time: '1 min',
          currency: 'eth',
          data: [
            {
              name: 'Transaction hash',
              value:
                '0xc06cdcc936536224054723679ba8ff616b1a5f1cac8cfa606ee03488bfb82ef0'
            },
            {
              name: 'Gas price',
              value: '41 Gwei'
            },
            {
              name: 'Gas limit',
              value: '40000'
            },
            {
              name: 'Max transaction fee',
              value: '0.00074444'
            }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-content {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.overlay-content {
  width: 700px;
}
</style>
