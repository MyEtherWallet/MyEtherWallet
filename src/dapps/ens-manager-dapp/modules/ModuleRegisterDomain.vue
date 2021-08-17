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
            class="mt-3"
            :name="name"
            :host-name="parsedHostName"
            :loading="checkingDomainAvail"
            :get-rent-price="getRentPrice"
            @onRequest="onRequest"
        /></template>
        <template #stepperContent2
          ><register
            v-if="onStep === 2"
            class="mt-3"
            :name="name"
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
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  components: { Request, Register },
  props: {
    getRentPrice: {
      default: function () {
        return {};
      },
      type: Function
    },
    commit: {
      default: function () {
        return {};
      },
      type: Function
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
    },
    generateKeyPhrase: {
      default: function () {
        return {};
      },
      type: Function
    },
    loadingCommit: {
      default: false,
      type: Boolean
    },
    committed: {
      default: false,
      type: Boolean
    },
    minimumAge: {
      default: '',
      type: String
    },
    name: {
      default: '',
      type: String
    },
    parsedHostName: {
      default: '',
      type: String
    },
    checkingDomainAvail: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      duration: 1,
      onStep: 1,
      stepperItems: [
        {
          step: 1,
          name: 'STEP 1. Select Duration'
        },
        {
          step: 2,
          name: 'STEP 2. Create Commitment'
        },
        {
          step: 3,
          name: 'STEP 3. Complete registration'
        }
      ]
    };
  },
  watch: {
    onStep(newStep) {
      if (newStep == 2) {
        this.$router.push({ name: ROUTES_WALLET.ENS_2.NAME });
      } else if (newStep == 3) {
        this.$router.push({ name: ROUTES_WALLET.ENS_3.NAME });
      } else {
        this.$router.push({ name: ROUTES_WALLET.ENS_MANAGER.NAME });
      }
    }
  },
  mounted() {
    if (this.onStep == 1) this.$router.push({ name: ROUTES_WALLET.ENS_1.NAME });
  },
  methods: {
    onRequest(val) {
      this.generateKeyPhrase();
      this.duration = val;
      this.onStep += 1;
    }
  }
};
</script>
