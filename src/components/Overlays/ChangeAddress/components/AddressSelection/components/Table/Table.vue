<template>
  <div>
    <v-tabs v-model="activeTab">
      <v-tab :key="1" />
      <v-tab :key="2" />

      <v-tab-item>
        <div class="width--100-percent">
          1
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="width--100-percent">
          2
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
export default {
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {
      activeTab: 1
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
