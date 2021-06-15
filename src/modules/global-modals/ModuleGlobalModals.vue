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
        <enter-pin-matrix v-if="openMatrix" @password="setPassword" />
        <hardware-password-modal
          v-if="openHardwarePassword"
          @password="setPassword"
          @setTerms="setTerms"
        />
      </template>
    </app-modal>
  </div>
</template>

<script>
import EnterPinMatrix from './components/EnterPinMatrix.vue';
import HardwarePasswordModal from './components/HardwarePasswordModal.vue';
import AppModal from '@/core/components/AppModal.vue';
import { EventBus } from '@/core/plugins/eventBus';
import { _ } from 'web3-utils';
const OPEN_MATRIX = 'showHardwarePinMatrix';
const OPEN_HARDWARE_PASSWORD = 'showHardwarePassword';
export default {
  components: {
    AppModal,
    EnterPinMatrix,
    HardwarePasswordModal
  },
  data() {
    return {
      deviceInfo: {},
      callback: () => {},
      openHardwarePassword: false,
      openMatrix: false,
      password: '',
      acceptTerms: false
    };
  },
  computed: {
    showModal() {
      return this.openMatrix || this.openHardwarePassword;
    },
    title() {
      const walletName = _.isEmpty(this.deviceInfo)
        ? 'wallet'
        : this.deviceInfo.name;
      return `Access your ${walletName}`;
    },
    enableButton() {
      if (this.openHardwarePassword) {
        return this.acceptTerms && this.password !== '';
      }
      return this.password !== '';
    }
  },
  created() {
    EventBus.$on(OPEN_MATRIX, (deviceInfo, callback) => {
      this.callback = callback;
      this.deviceInfo = deviceInfo;
      this.openMatrix = true;
    });
    EventBus.$on(OPEN_HARDWARE_PASSWORD, (deviceInfo, callback) => {
      this.callback = callback;
      this.deviceInfo = deviceInfo;
      this.openHardwarePassword = true;
    });
  },
  methods: {
    reset() {
      this.deviceInfo = {};
      this.callback = () => {};
      this.identifier = '';
      this.openHardwarePassword = false;
      this.openMatrix = false;
      this.password = '';
      this.acceptTerms = false;
    },
    submit() {
      this.callback(this.password);
      this.reset();
    },
    setPassword(e) {
      this.password = e;
    },
    setTerms(e) {
      this.acceptTerms = e;
    }
  }
};
</script>
