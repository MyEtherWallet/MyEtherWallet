<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions>
      <div class="d-flex align-center px-4 py-3">
        <PanelHeader :title="title" :subtitle="subtitle" />
        <div class="ml-auto">
          <v-btn
            depressed
            x-small
            fab
            dark
            :retain-focus-on-click="true"
            color="emerald"
          >
            <v-icon dark>mdi-pencil-outline</v-icon>
          </v-btn>
        </div>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="px-4 pt-2 pb-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import PanelHeader from '../PanelHeader';

export default {
  components: { PanelHeader },
  props: {
    title: { default: '', type: String },
    subtitle: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
