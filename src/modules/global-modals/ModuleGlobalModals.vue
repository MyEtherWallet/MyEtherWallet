<template>
  <div>
    <app-modal
      :show="showModal"
      :title="title"
      :btn-action="submit"
      :close="reset"
      :btn-enabled="enableButton"
      @close="reset"
    >
      <template #dialogBody>
        <hardware-password-modal
          v-if="openHardwarePassword"
          @password="setPassword"
          @setTerms="setTerms"
        />
      </template>
    </app-modal>
    <error-msg
      :show="openError"
      :close="reset"
      :resolve="send"
      :error="errors"
    />
  </div>
</template>

<script>
const OPEN_HARDWARE_PASSWORD = 'showHardwarePassword';
const ISSUE_MODAL = 'issueModal';
</script>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { isEmpty } from 'lodash';

import HardwarePasswordModal from './components/HardwarePasswordModal.vue';
import ErrorMsg from './components/ErrorMsg.vue';

import { EventBus } from '@/core/plugins/eventBus';

// data
const deviceInfo = ref({});
const callback = ref(() => {});
const openHardwarePassword = ref(false);
const openError = ref(false);
const password = ref('');
const acceptTerms = ref(false);
const errors = ref({});

// computed
const showModal = computed(() => openHardwarePassword.value);
const title = computed(() => {
  const walletName = isEmpty(deviceInfo.value)
    ? 'wallet'
    : deviceInfo.value.name;
  return `Access your ${walletName}`;
});
const enableButton = computed(() => {
  if (openHardwarePassword.value) {
    return acceptTerms.value && password.value !== '';
  }
  return password.value !== '';
});

// created
onMounted(() => {
  EventBus.$on(ISSUE_MODAL, (errors, callback) => {
    errors.value = errors;
    callback.value = callback;
    openError.value = true;
  });
  EventBus.$on(OPEN_HARDWARE_PASSWORD, (deviceInfo, callback) => {
    callback.value = callback;
    deviceInfo.value = deviceInfo;
    openHardwarePassword.value = true;
  });
});

// beforeDestroy
onUnmounted(() => {
  EventBus.$off(ISSUE_MODAL);
  EventBus.$off(OPEN_HARDWARE_PASSWORD);
});

// methods
const reset = () => {
  deviceInfo.value = {};
  callback.value = () => {};
  openHardwarePassword.value = false;
  openError.value = false;
  password.value = '';
  acceptTerms.value = false;
};

const submit = () => {
  callback.value(password.value);
  reset();
};

const setPassword = e => {
  password.value = e;
};

const setTerms = e => {
  acceptTerms.value = e;
};

const send = bool => {
  callback.value(bool);
  reset();
};
</script>
