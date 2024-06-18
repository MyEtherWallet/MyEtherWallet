<template>
  <!--
=====================================================================================
  Mew Warning Sheet 
=====================================================================================
-->
  <v-row class="mx-0" align="end" justify="center">
    <v-sheet
      class="px-10 py-6 rounded"
      color="warning"
      height="100%"
      width="100%"
    >
      <v-row align="start" justify="start">
        <v-col cols="auto">
          <v-icon class="title" color="warning darken-2"> mdi-alert </v-icon>
        </v-col>
        <v-col class="d-flex flex-column titlePrimary--text">
          <span class="text-uppercase font-weight-bold">{{ title }}</span>
          <span>
            {{ description }}
            <a v-if="!bottom" :href="linkObj.url">{{ linkObj.title }} </a>
          </span>
          <span v-if="bottom">
            <a :href="linkObj.url">{{ linkObj.title }} </a>
          </span>
        </v-col>
      </v-row>
    </v-sheet>
  </v-row>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  bottom: {
    type: Boolean,
    default: true
  },
  linkObj: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
</script>
