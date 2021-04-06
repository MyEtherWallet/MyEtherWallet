<template>
  <v-sheet class="border-radius--10px pa-4 pa-md-10">
    <v-row class="align-end justify-start">
      <v-col cols="12">
        <!--
    =====================================================================================
      Title
    =====================================================================================
    -->
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold">Select HD Derivation Path</div>
        <p class="mb-5">
          <!--          Please select HD Derivation Path that you you want to interact with or-->
          <!--          enter a custom one.-->
        </p>
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
          <mew-select
            v-model="path"
            label="HD derivation path"
            :items="paths"
          />
        </div>
        <mew-button
          btn-size="xlarge"
          title="Unlock wallet"
          has-full-width
          @click.native="nextStep"
        />
      </v-col>
    </v-row>
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
