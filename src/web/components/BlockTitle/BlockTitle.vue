<template>
  <div class="block-title" :class="data.centered ? 'text-center' : ''">
    <div
      v-if="data.toptitle"
      class="top-title text-uppercase font-weight-bold grey--text text--lighten-1 mb-2"
      :class="data.textProps"
    >
      {{ data.toptitle }}
    </div>
    <v-sheet
      :max-width="data.titleMaxWidth ? data.titleMaxWidth : '450px'"
      color="transparent"
      :class="data.centered ? 'mx-auto' : ''"
    >
      <h2 v-if="data.title" :class="data.textProps">
        {{ data.title }}
      </h2>
    </v-sheet>
    <div class="mt-3" />
    <v-sheet
      :max-width="data.descriptionMaxWidth"
      color="transparent"
      :class="data.centered ? 'mx-auto' : ''"
    >
      <p v-if="data.description" :class="data.textProps" class="ma-0">
        {{ data.description }}
      </p>
      <div><slot /></div>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    data: {
      default: function () {
        return {};
      },
      type: Object
    }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.top-title {
  letter-spacing: -0.3px;
  font-size: 16px;
}
</style>
