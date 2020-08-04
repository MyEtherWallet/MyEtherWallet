<template>
  <v-expansion-panels flat class="border-radius--10px">
    <v-expansion-panel class="border-radius--10px">
      <v-expansion-panel-header hide-actions>
        <div class="d-flex align-center px-2 py-3">
          <div class="d-flex align-center">
            <div v-if="title" class="headline font-weight-bold mr-3">
              {{ title }}
            </div>
            <div v-if="subtitle" class="grey--text">{{ subtitle }}</div>
          </div>
          <div class="ml-auto">
            <v-btn
              depressed
              x-small
              fab
              dark
              :retain-focus-on-click="true"
              color="#cdf4ef"
            >
              <v-icon dark>mdi-pencil-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="px-4 pt-0 pb-3">
          <slot></slot>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
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

<style lang="scss" scoped></style>
