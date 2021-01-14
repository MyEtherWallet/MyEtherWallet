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
            :name="nameModule.name"
            @onRequest="onRequest"
        /></template>
        <template #stepperContent2
          ><register
            v-if="onStep === 2"
            :name="nameModule.name"
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
      return this.nameModule.owner === '0x';
    }
  },
  watch: {
    nameModule(newVal) {
      this.committed = newVal.createCommitment ? false : true;
      console.error('nameModule', this.committed);
    }
  },
  methods: {
    clear() {
      this.onStep = 1;
      this.committed = false;
      this.duration = '';
    },
    commit() {
      this.loadingCommit = true;
      this.nameModule.getMinimumAge().then(resp => {
        this.minimumAge = resp;
      });
      this.nameModule
        .createCommitment()
        .then(resp => {
          this.loadingCommit = false;
          this.committed = true;
          console.error('committed', resp);
          console.error('minimum', this.minimumAge);
        })
        .catch(err => {
          console.error('commit err', err);
        });
    },
    register() {
      console.error('in register');
      this.nameModule
        .register(this.duration)
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('register err', err);
        });
    },
    onRequest(val) {
      if (!this.isAvailable) {
        this.close();
        return;
      }
      if (this.nameModule.generateKeyPhrase) {
        this.nameModule.generateKeyPhrase();
      }
      this.duration = val;
      this.onStep += 1;
    }
  }
};
</script>
