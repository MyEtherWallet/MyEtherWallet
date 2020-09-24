<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Cancel"
    @closeOverlay="$emit('close')"
  >
    <template v-slot:mewOverlayBody>
      <v-container v-if="step === 1">
        <h2 class="text-center mb-10">1. Enter your password</h2>
        <mew6-white-sheet max-width="600px" class="mx-auto pa-4 pa-sm-12">
          <div class="mb-6 font-weight-bold">Enter your Bitbox password.</div>
          <v-text-field
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter keystore file password"
            outlined
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <mew-checkbox
            class="justify-center"
            label="To access my wallet, I accept"
            :link="linkToTerms"
          />

          <div class="d-flex justify-center mt-2">
            <mew-button
              title="Access my wallet"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="step = 2"
            />
          </div>
        </mew6-white-sheet>
      </v-container>
      <v-container v-if="step === 2">
        <h2 class="text-center mb-10">1. Match your encryption pairing code</h2>
        <mew6-white-sheet max-width="600px" class="mx-auto pa-4 pa-sm-12">
          <div class="mb-4 font-weight-bold">
            Please confirm the encryption pairing code matches what is shown on
            your BitBox 02.
          </div>

          <div>
            Notice: You need to enter BitBox 02 password to unlock your device
            first.
          </div>

          <v-sheet max-width="200px" class="mx-auto mt-10 text-center">
            <v-row>
              <v-col v-for="(c, key) in pairingCode" :key="key" cols="6">
                <h4>
                  <strong class="monospace">{{ c }}</strong>
                </h4>
              </v-col>
            </v-row>
          </v-sheet>

          <mew-checkbox
            class="justify-center"
            label="To access my wallet, I accept"
            :link="linkToTerms"
          />

          <div class="d-flex justify-center mt-2">
            <mew-button
              title="Access my wallet"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="step = 2"
            />
          </div>
        </mew6-white-sheet>
      </v-container>
      <v-container v-if="step === 3">
        <h2 class="text-center mb-10">1. Enter your password</h2>
        <mew6-white-sheet max-width="600px" class="mx-auto">
          <address-table />
        </mew6-white-sheet>
      </v-container>

      <page-indicator-dot class="mt-4" :items="3" :current-item="step" />
    </template>
  </mew-overlay>
</template>

<script>
import addressTable from './components/AddressTable/AddressTable';
import pageIndicatorDot from '@/components/page-indicator-dot/PageIndicatorDot';

export default {
  components: {
    addressTable,
    pageIndicatorDot
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      step: 1,
      showPassword: false,
      linkToTerms: {
        title: 'Terms.',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      pairingCode: ['AUNEF', 'NE237', 'ALUC3', 'A86N0']
    };
  }
};
</script>

<style lang="scss" scoped></style>
