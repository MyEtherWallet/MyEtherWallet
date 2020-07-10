<template>
  <div class="mew-component--expantion-block">
    <DividerLine class="mb-2" />
    <v-expansion-panels v-model="isOpen" flat>
      <v-expansion-panel>
        <v-expansion-panel-header class="pl-2 pr-0 py-0">
          <div class="d-flex align-center justify-space-between pr-4">
            <div class="d-flex align-center">
              <div class="font-weight-bold subtitle-1 mr-2">{{ title }}</div>
              <info-tooltip v-if="helpText" :text="helpText" />
            </div>
            <div>{{ rightText }}</div>
          </div>
          <template v-slot:actions>
            <v-switch v-model="switch1" inset></v-switch>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="py-4">
            <slot />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <DividerLine class="mt-2" />
  </div>
</template>

<script>
import DividerLine from '@/web/components/Common/DividerLine';
export default {
  components: {
    DividerLine
  },
  props: {
    title: { default: '', type: String },
    rightText: { default: '', type: String },
    helpText: { default: '', type: String }
  },
  data() {
    return { isOpen: undefined, switch1: false };
  },
  watch: {
    isOpen(val) {
      this.switch1 = val == 0 ? true : false;
    }
  },
  mounted() {
    this.switch1 = this.isOpen == 0 ? true : false;
  }
};
</script>

<style lang="scss">
//@import '@/assets/styles/GlobalVariables.scss';
.mew-component--expantion-block {
  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }
}
</style>
