<template>
  <v-sheet tile class="page-title-container pb-12 pt-2" color="expandHeader">
    <v-container class="text-center">
      <div class="white--text display-1 font-weight-bold">{{ title }}</div>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: 'HomeHeader',
  components: {},
  props: { title: { default: '', type: String } }
};
</script>
