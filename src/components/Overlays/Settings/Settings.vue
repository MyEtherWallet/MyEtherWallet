<template>
  <BaseOverlay :open="open" :close="close" :back="false" close-text="Cancel">
    <OverlayTitle title="Settings" />

    <div class="overlay-content">
      <v-expansion-panels flat light>
        <ExpansionPanelContent title="Gas price" subtitle="1 Gwei (Economic)">
          aaaa
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Import configurations">
          aaaa
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Export configurations">
          <StdButton />
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Contact address">
          aaa
        </ExpansionPanelContent>
      </v-expansion-panels>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import StdButton from '@/web/components/StdButton';
import ExpansionPanelContent from './components/ExpansionPanelContent';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    StdButton,
    ExpansionPanelContent
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function() {
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
@import '@/assets/styles/GlobalVariables.scss';

.overlay-content {
  width: 650px;
}

.v-expansion-panel {
  margin-top: 20px !important;
  border-radius: 12px !important;
  box-shadow: $gray-3 0px 0px 15px;

  &:first-child {
    margin-top: 0px !important;
  }
}
</style>
