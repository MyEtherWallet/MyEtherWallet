<template>
  <v-row class="align-end justify-start">
    <v-col cols="12">
      <!--
      =====================================================================================
        Title
      =====================================================================================
      -->
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="headline font-weight-bold mb-5">
        Select HD Derivation Path
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
          :items="parsedPaths"
          label="Select Path"
          :has-filter="true"
          filter-placeholder="Search Path"
        />
      </div>
      <div class="text-center">
        <mew-button
          btn-size="xlarge"
          title="Unlock wallet"
          @click.native="nextStep"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// emits
const emits = defineEmits(['setPath', 'setLedgerApp']);

// props
const props = defineProps({
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
  }
});

// data
const path = ref({});
const ledgerApp = ref({});

// computed
const parsedPaths = computed(() => {
  return props.paths.map(item => {
    const newObj = {};
    newObj['name'] = item['name'];
    newObj['subtext'] = item['value'];
    newObj['value'] = item['value'];
    return newObj;
  });
});

// watch
watch(
  () => path,
  newVal => {
    emits('setPath', newVal);
  }
);

watch(
  () => ledgerApp,
  newVal => {
    emits('setLedgerApp', newVal);
  }
);
</script>
