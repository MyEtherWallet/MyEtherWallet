<template>
  <div class="mew-component--expantion-block">
    <DividerLine class="mb-2" />
    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-header class="px-4 py-0">
          <div class="font-weight-bold subtitle-1">{{ title }}</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <slot />
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
    title: { default: '', type: String }
  },
  data() {
    return {};
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
