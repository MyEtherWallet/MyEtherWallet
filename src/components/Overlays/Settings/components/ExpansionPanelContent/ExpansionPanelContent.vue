<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions>
      <div class="d-flex align-center px-4 py-3">
        <div class="d-flex align-center">
          <div v-if="title" class="headline font-weight-bold mr-3">
            {{ title }}
          </div>
          <div v-if="subtitle" class="subtitle-color">{{ subtitle }}</div>
        </div>
        <div class="ml-auto">
          <slot name="headerButtons"></slot>
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
        <slot name="content"></slot>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  components: {},
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
@import '@/assets/styles/GlobalVariables.scss';

.subtitle-color {
  color: $gray-4;
}
</style>
