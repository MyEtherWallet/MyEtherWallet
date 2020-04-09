<template>
  <BaseOverlay :open="open" :close="close" :back="true" close-text="Cancel">
    <OverlayTitle title="Network" />
    <TabButtons>
      <v-card color="red" class="pa-5" @click="activeTab = 0"
        >Change network</v-card
      >
      <v-card @click="activeTab = 1">Add network/HTTP</v-card>
    </TabButtons>

    <OverlayTabs class="overlay-content">
      <v-tabs v-model="activeTab">
        <v-tab :key="1" />
        <v-tab :key="2" />

        <v-tab-item>
          <div class="width--100-percent">
            <WhiteSheet>
              <div class="pa-8">
                1
                <StdButton size="x-large" fullwidth>
                  Change
                </StdButton>
              </div>
            </WhiteSheet>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="width--100-percent">
            <WhiteSheet>
              <div class="pa-8">
                2
                <StdButton size="x-large" fullwidth>
                  Save
                </StdButton>
              </div>
            </WhiteSheet>
          </div>
        </v-tab-item>
      </v-tabs>
    </OverlayTabs>
  </BaseOverlay>
</template>

<script>
import TabButtons from '@/web/components/Buttons/TabButtons';
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';

export default {
  components: {
    TabButtons,
    BaseOverlay,
    OverlayTitle,
    OverlayTabs,
    WhiteSheet,
    StdButton
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
      activeTab: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.v-tabs-bar {
  //display: none;
}

.overlay-content {
  width: 500px;
}
</style>
