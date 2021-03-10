<template>
  <v-sheet class="overlay-content pa-8">
    <div class="text-center mb-8">
      <img :src="icon" alt="Network Icon" height="60" />
    </div>
    <div>
      <mew-select
        v-if="onLedger"
        v-model="ledgerApp"
        label="Open Ledger App"
        :items="ledgerApps"
      />
      <mew-select v-model="path" label="HD derivation path" :items="paths" />
    </div>
    <mew-button
      btn-size="xlarge"
      title="Unlock wallet"
      has-full-width
      @click.native="nextStep"
    />
  </v-sheet>
</template>

<script>
export default {
  props: {
    paths: {
      type: Array,
      default: () => []
    },
    nextStep: {
      type: Function,
      default: () => {}
    },
    ledgerApps: {
      type: Array,
      default: () => []
    },
    onLedger: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      path: {},
      ledgerApp: {}
    };
  },
  watch: {
    path(newVal) {
      this.$emit('setPath', newVal);
    },
    ledgerApp(newVal) {
      this.$emit('setLedgerApp', newVal);
    }
  }
};
</script>
