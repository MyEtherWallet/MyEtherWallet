<template>
  <v-dialog
    v-model="onCreatePassword"
    max-width="600px"
    content-class="staked-create-pw-dialog"
  >
    <div class="white pa-3 pa-sm-8 position--relative">
      <v-btn icon class="close-button" @click="onCreatePassword = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div class="mew-heading-2 text-center">Choose password</div>

      <div class="mt-8">
        <div>Protect your keystore file with password</div>
        <mew-input
          v-model="password"
          type="password"
          hint="Password must be 8 or more characters"
          class="mt-8"
          :has-clear-btn="true"
          :error-messages="passwordErrMessages"
          :rules="[value => !!value || 'Required']"
          label="New password"
        />
        <mew-input
          v-model="confirmPassword"
          :error-messages="confirmPasswordErrMessages"
          type="password"
          class="mt-2"
          label="Confirm password"
        />

        <div class="mt-1 greyLight terms-container pa-5">
          <mew-checkbox
            v-model="userTermsAgreed"
            class-name="textMedium--text"
            :label="userTermsLabel"
          ></mew-checkbox>
        </div>
        <mew-button
          icon-type="mdi"
          icon-align="left"
          icon="mdi-download"
          :has-full-width="vuetify.breakpoint.smAndDown"
          class="d-block mx-auto mt-8"
          btn-size="xlarge"
          :disabled="
            !password ||
            confirmPassword === '' ||
            confirmPasswordErrMessages !== '' ||
            passwordErrMessages !== '' ||
            !userTermsAgreed
          "
          title="Download keystore file"
          @click.native="generateKeystore"
        />
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useVuetify } from '../composables/vuetify';

// injections
const vuetify = useVuetify();

// emits
const emits = defineEmits(['onDialogStateChange', 'generate']);

// props
const props = defineProps({
  opened: {
    type: Boolean,
    default: false
  }
});

// data
const onCreatePassword = ref(false);
const password = ref('');
const confirmPassword = ref('');
const userTermsAgreed = ref(false);
const userTermsLabel =
  'I understand that MEW has no control over any assets I choose to associate with these keys and willingly assume all risk of loss, including those coming as a result of protocol or key failure.';

// computed
const passwordErrMessages = computed(() => {
  if (password.value && password.value.length < 8) {
    return 'Password is less than 8 characters';
  }
  return '';
});

const confirmPasswordErrMessages = computed(() => {
  if (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  ) {
    return 'Passwords do not match';
  }
  return '';
});

// watch
watch(
  () => props.opened,
  newVal => {
    onCreatePassword.value = newVal;
  }
);

watch(
  () => onCreatePassword.value,
  newVal => {
    emits('onDialogStateChange', newVal);
  }
);

// onMounted
onMounted(() => {
  onCreatePassword.value = props.opened;
});

// methods
const generateKeystore = () => {
  emits('generate', password.value);
};
</script>

<style lang="scss">
.staked-create-pw-dialog {
  border-radius: 10px;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
