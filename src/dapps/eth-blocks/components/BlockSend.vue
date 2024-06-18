<template>
  <!--
=====================================================================================
  Overlay - send eth block
=====================================================================================
-->
  <mew-overlay
    :show-overlay="open"
    :title="title"
    :close="close"
    content-size="medium"
  >
    <div class="full-width pt-8 pt-md-0">
      <module-address-book
        v-if="open"
        ref="addressInput"
        class="mb-4"
        @setAddress="setAddress"
      />
      <mew-button
        title="Send ETH Block"
        has-full-width
        btn-size="xlarge"
        :disabled="disableSend"
        :loading="isSending"
        @click.native="sendBlock()"
      />
    </div>
  </mew-overlay>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';

// emits
const emits = defineEmits(['send']);

// props
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {}
  },
  blockNumber: {
    type: String,
    default: ''
  },
  isSending: {
    type: Boolean,
    default: false
  }
});

// data
const isValidAddress = ref(false);
const toAddress = ref('');
const addressInput = ref(null);

// computed
const title = computed(() => `Send ETH Block #${props.blockNumber}`);
const disableSend = computed(() => !isValidAddress.value || props.isSending);

// watch
watch(
  () => props.open,
  newVal => {
    if (newVal === false) {
      addressInput.value.clear();
    }
  }
);

// methods
const setAddress = (addr, isValidAddress) => {
  if (isValidAddress) {
    toAddress.value = addr;
  }
  isValidAddress.value = isValidAddress;
};

const sendBlock = () => {
  if (isValidAddress.value) {
    emits('send', toAddress.value);
  }
};
</script>
