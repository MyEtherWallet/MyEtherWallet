<template>
  <div>
    <v-sheet
      class="addressBlock d-flex justify-space-between align-center mb-7"
    >
      <mew-blockie :address="address" />
      <span class="font-weight-heavy pr-15">{{ address }}</span>
    </v-sheet>
    <div v-if="!hasDomains">
      <mew-alert
        hide-close-icon
        class="font-weight-light d-flex justify-space-between align-center mb-7 mt-7"
      >
        No RNS names have their Rootstock Address records set to this address.
      </mew-alert>
    </div>

    <div v-else class="d-flex flex-column justify-space-between">
      <div class="mew-heading-2 mb-2">Your Domain:</div>
      <a
        class="d-flex justify-space-between"
        target="_blank"
        :href="
          'https://manager.rns.rifos.org/resolve?name=' + reverseRecordName
        "
      >
        {{ reverseRecordName }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

// props
const props = defineProps({
  address: {
    default: '',
    type: String
  },
  rnsManager: {
    default: () => {},
    type: Object
  }
});

// data
const hasDomains = ref(true);
const reverseRecordName = ref('Loading...');

// mounted
onMounted(() => {
  if (props.rnsManager) {
    props.rnsManager
      .resolveReverseName(props.address)
      .then(name => {
        hasDomains.value = name ? true : false;
        reverseRecordName.value = name || '';
      })
      .catch(e => {
        Toast(e, {}, ERROR);
      });
  }
});
</script>
