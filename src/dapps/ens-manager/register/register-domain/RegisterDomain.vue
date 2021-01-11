<template>
  <mew-overlay
    :show-overlay="onRegister"
    title="Register domain"
    right-btn-text="Cancel"
    :close="close"
  >
    <template #mewOverlayBody>
      <mew-stepper :items="stepperItems" :on-step="onStep">
        <template #stepperContent1
          ><request
            v-if="onStep === 1"
            :is-available="isAvailable"
            :name="nameModule.name"
            @onRequest="onRequest"
        /></template>
        <template #stepperContent2
          ><register
            v-if="onStep === 2"
            :name="nameModule.name"
            :duration="duration"
            :register="register"
        /></template>
        <template #stepperContent3><complete v-if="onStep === 3" /></template>
      </mew-stepper>
    </template>
  </mew-overlay>
</template>

<script>
import Request from './components/Request/Request';
import Register from './components/Register/Register';
import Complete from './components/Complete/Complete';

export default {
  components: { Request, Register, Complete },
  props: {
    nameModule: {
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
    }
  },
  data() {
    return {
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
      return this.nameModule.owner === '0x';
    }
  },
  methods: {
    register() {
      console.error('in here');
      this.nameModule
        .register(this.duration)
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    onRequest(val) {
      if (!this.isAvailable) {
        this.close();
        return;
      }
      this.duration = val;
      this.onStep += 1;
    }
  }
};
</script>
