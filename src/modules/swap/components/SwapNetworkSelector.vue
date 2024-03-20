<template>
  <div>
    <v-btn
      block
      x-large
      class="d-flex justify-space-between pa-2 swap-network-selector"
      @click="openDialog"
    >
      <div class="d-flex justify-start">
        <img :src="selectedIcon" width="40px" height="40px" />
        <div class="text-left pl-2 d-flex flex-column justify-center">
          <div class="mew-heading-3">To Network</div>
          <span class="network-name">{{ selectedNetwork.name }}</span>
        </div>
      </div>
      <v-icon class="ml-3"> mdi-chevron-down </v-icon></v-btn
    >
    <v-dialog :value="open" scrollable width="440" @click:outside="closeDialog">
      <v-sheet v-if="open" class="pa-3">
        <div class="mew-heading-1 mt-2 mb-5">Select To Network</div>
        <div class="networks-container">
          <div v-for="(t, i) in networks" :key="i" class="mb-3">
            <v-btn
              class="cursor--pointer px-2 py-4 d-flex align-center justify-start swap-network-selector"
              block
              x-large
              @click="setSelectedNetwork(t)"
            >
              <img
                :src="`https://img.mewapi.io/?image=${t.logoURI}`"
                width="40px"
                height="40px"
              />
              <div class="ml-2 mew-heading-4">{{ t.name }}</div>
            </v-btn>
          </div>
        </div>
      </v-sheet>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    selectedNetwork: {
      type: Object,
      default: () => {}
    },
    networks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    selectedIcon() {
      return `https://img.mewapi.io/?image=${this.selectedNetwork.logoURI}`;
    }
  },
  methods: {
    setSelectedNetwork(e) {
      this.$emit('selectedNetwork', e);
      this.closeDialog();
    },
    openDialog() {
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.network-name {
  font-size: 12px;
}

.swap-network-selector {
  height: auto !important;
  background-color: white !important;
  box-shadow: none !important;
}

.networks-container {
  height: 400px;
  overflow-y: scroll;
}
</style>
