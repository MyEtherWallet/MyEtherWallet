<template>
  <v-sheet
    :outlined="true"
    color="white"
    :rounded="true"
    :max-width="740"
    :min-width="575"
    :min-height="340"
  >
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <p class="mt-2 mew-heading-3 text-center">
            Please enter the password of your
            <span class="text-capitalize">{{ walletType }}</span> device.
          </p>
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="10">
                <mew-input
                  v-model="password"
                  label="Password"
                  placeholder="Enter your password"
                  :type="onCoolWallet ? 'text' : 'password'"
                />
                <div class="d-flex align-center flex-column">
                  <mew-button
                    title="Access My Wallet"
                    btn-size="xlarge"
                    :disabled="!(password !== '' && acceptTerms)"
                    @click.native="
                      () => {
                        nextStep();
                      }
                    "
                  />
                  <mew-checkbox
                    v-model="acceptTerms"
                    label="To access my wallet, I accept "
                    :link="link"
                    class="justify-center"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  props: {
    walletType: {
      default: '',
      type: String
    },
    onCoolWallet: {
      default: false,
      type: Boolean
    },
    nextStep: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      acceptTerms: false,
      password: '',
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  watch: {
    password(newVal) {
      this.$emit('setPassword', newVal);
    },
    acceptTerms(newVal) {
      this.$emit('setTerms', newVal);
    }
  }
};
</script>
