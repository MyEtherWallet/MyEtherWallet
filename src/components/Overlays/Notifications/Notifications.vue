<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <div class="overlay-content">
      <OverlayTitle title="Notifications" />
      <mew6-white-sheet>
        <div class="pa-4">
          <div>
            <div class="text-center font-weight-regular title">
              1/8/2020
            </div>
            <v-expansion-panels hover flat>
              <In />
              <Out />
              <Swap />
            </v-expansion-panels>
          </div>
        </div>
      </mew6-white-sheet>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import In from './components/In';
import Out from './components/Out';
import Swap from './components/Swap';
import OverlayTitle from '@/components/OverlayTitle';

export default {
  components: {
    BaseOverlay,
    In,
    Out,
    Swap,
    OverlayTitle
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
    return {};
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
