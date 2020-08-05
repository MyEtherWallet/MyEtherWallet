<template>
  <div>
    <SteppersHeader
      :key="steppersResetKey"
      :tabs="tabs"
      :active-tab="steppersHeaderTab"
      class="mb-8"
    />
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(t, key) in tabs"
        :key="key"
        :value="'tab-' + (key + 1)"
      >
        <component :is="t.content"></component>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import SteppersHeader from '@/components/Steppers/SteppersHeader';

export default {
  components: { SteppersHeader },
  props: {
    tabs: { default: () => [], type: Array }
  },
  data: () => ({
    tab: 'tab-1',
    steppersHeaderTab: 1,
    steppersResetKey: 100
  }),
  watch: {
    $route() {
      this.checkQueryStep();
    }
  },
  mounted() {
    this.checkQueryStep();
  },
  methods: {
    checkQueryStep() {
      const currentStep = this.$route.query.step;
      if (currentStep) {
        this.tab = 'tab-' + currentStep;
        this.steppersHeaderTab = parseInt(currentStep);
      } else {
        this.tab = 'tab-1';
        this.steppersHeaderTab = 1;
      }
      this.steppersResetKey++;
    }
  }
};
</script>

<style lang="scss" scoped>
.theme--light.v-tabs-items,
.theme--dark.v-tabs-items {
  background-color: transparent;
}
</style>
