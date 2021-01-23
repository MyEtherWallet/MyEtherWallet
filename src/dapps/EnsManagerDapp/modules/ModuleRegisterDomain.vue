<template>
  <mew-overlay
    :show-overlay="onRegister"
    :title="$t('ens.register-domain')"
    :right-btn-text="$t('common.cancel')"
    :close="close"
  >
    <template #mewOverlayBody>
      <mew-stepper :items="stepperItems" :on-step="onStep">
        <template #stepperContent1
          ><request
            v-if="onStep === 1"
            :is-available="isAvailable"
            :name="nameHandler.name"
            :host-name="nameHandler.parsedHostName"
            :loading="loading"
            @onRequest="onRequest"
        /></template>
        <template #stepperContent2
          ><register
            v-if="onStep === 2"
            :name="nameHandler.name"
            :duration="duration"
            :register="register"
            :commit="commit"
            :committed="committed"
            :minimum-age="minimumAge"
            :loading-commit="loadingCommit"
        /></template>
        <template #stepperContent3><complete v-if="onStep === 3" /></template>
      </mew-stepper>
    </template>
  </mew-overlay>
</template>

<script>
import Request from '../components/register/RegisterRequest';
import Register from '../components/register/Register';
import Complete from '../components/register/RegisterComplete';
import { EventBus } from '@/plugins/eventBus';
import EventNames from '@/utils/web3-provider/events.js';
import { Toast, ERROR } from '@/components/toast';

export default {
  components: { Request, Register, Complete },
  props: {
    nameHandler: {
      default: () => {
        return {};
      },
      type: Object
    },
    onRegister: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    register: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      loadingCommit: false,
      minimumAge: '',
      committed: false,
      duration: '',
      onStep: 1,
      stepperItems: [
        {
          step: 1,
          name: 'STEP 1. Request registration'
        },
        {
          step: 2,
          name: 'STEP 2. Register domain'
        },
        {
          step: 3,
          name: 'STEP 3. Complete registration'
        }
      ]
    };
  },
  computed: {
    isAvailable() {
      return this.nameHandler.isAvailable;
    },
    loading() {
      return this.nameHandler.checkingDomainAvail;
    }
  },
  watch: {
    nameHandler(newVal) {
      this.committed = newVal.createCommitment ? false : true;
    }
  },
  methods: {
    clear() {
      this.onStep = 1;
      this.committed = false;
      this.duration = '';
    },
    commit() {
      this.nameHandler.getMinimumAge().then(resp => {
        this.minimumAge = resp;
      });
      // start timer after confirming tx
      EventBus.$on(EventNames.CONFIRMED_TX, () => {
        this.loadingCommit = true;
      });
      this.nameHandler

        .createCommitment()
        .then(() => {
          this.loadingCommit = false;
          this.committed = true;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    onRequest(val) {
      if (!this.isAvailable) {
        this.close();
        return;
      }
      if (this.nameHandler.generateKeyPhrase) {
        this.nameHandler.generateKeyPhrase();
      }
      this.duration = val;
      this.onStep += 1;
    }
  }
};
</script>
