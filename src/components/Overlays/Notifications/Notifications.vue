<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <div class="overlay-content">
      <OverlayTitle title="Notifications" />
      <WhiteSheet>
        <div class="pa-4">
          <div>
            <div class="text-center font-weight-regular title pa-2">
              1/8/2020
            </div>
            <v-expansion-panels hover flat>
              <In />
            </v-expansion-panels>
          </div>
        </div>
      </WhiteSheet>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import In from './components/In';
import OverlayTitle from '@/components/OverlayTitle';
import WhiteSheet from '@/web/components/Common/WhiteSheet';

export default {
  components: {
    BaseOverlay,
    In,
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
