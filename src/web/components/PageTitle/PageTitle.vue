<template>
  <v-sheet
    tile
    class="page-title-container pb-11 pt-5"
    color="light-blue darken-4"
  >
    <v-container class="text-center">
      <div class="white--text display-1 font-weight-bold">{{ title }}</div>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: 'PageTitle',
  components: {},
  props: { title: { default: '', type: String } }
};
</script>
