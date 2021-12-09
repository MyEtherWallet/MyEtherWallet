<template>
  <v-sheet
    color="transparent"
    :max-width="maxWidth"
    :class="[
      data.centered ? 'text-center' : '',
      !noPageTitle ? 'page-title' : ''
    ]"
  >
    <div v-if="!noPageTitle" class="py-7 d-none d-lg-block"></div>
    <div v-if="!noPageTitle" class="py-4 d-block d-lg-none"></div>

    <div
      v-if="data.toptitle"
      class="
        top-title
        text-uppercase
        font-weight-bold
        grey--text
        text--lighten-1
        mb-2
      "
      :class="data.textProps"
    >
      {{ data.toptitle }}
    </div>
    <v-sheet
      :max-width="data.titleMaxWidth ? data.titleMaxWidth : '450px'"
      color="transparent"
      :class="data.centered ? 'mx-auto' : ''"
    >
      <h1 v-if="data.title" :class="data.textProps">
        {{ data.title }}
      </h1>
    </v-sheet>
    <div class="mt-3" />
    <v-sheet
      :max-width="data.descriptionMaxWidth"
      color="transparent"
      :class="data.centered ? 'mx-auto' : ''"
    >
      <h5 v-if="data.description" :class="data.textProps" class="ma-0">
        {{ data.description }}
      </h5>
      <div><slot /></div>
    </v-sheet>
    <div v-if="!noPageTitle" class="py-6"></div>
  </v-sheet>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    maxWidth: { default: '', type: String },
    noPageTitle: { default: false, type: Boolean },
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
.page-title {
  max-width: 500px;
  margin: 0 auto;
}

.top-title {
  letter-spacing: -0.3px;
  font-size: 16px;
}
</style>
