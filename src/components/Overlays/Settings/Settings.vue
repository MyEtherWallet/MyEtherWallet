<template>
  <BaseOverlay :open="open" :close="close" :back="false" close-text="Cancel">
    <OverlayTitle title="Settings" />

    <div class="overlay-content">
      <v-expansion-panels flat light>
        <ExpansionPanelContent title="Gas price" subtitle="1 Gwei (Economic)">
          <template v-slot:headerButtons> </template>
          <template v-slot:content> </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Import configurations">
          <template v-slot:content>
            <div class="mb-7">
              Please upload the file, and click the button on the left top to
              open and import you configuration file from your local computer.
            </div>
            <div class="d-flex align-start">
              <v-file-input
                color="emerald"
                label="Upload file..."
                filled
              ></v-file-input>
              <StdButton
                buttonclass="button--green-border"
                class="ml-3"
                height="57px"
              >
                Import
              </StdButton>
            </div>
          </template>
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
