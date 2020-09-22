<template>
  <v-sheet color="transparent" max-width="650px" width="100%" class="mx-auto">
    <h2 class="text-center mb-10">Keystore file</h2>

    <mew6-white-sheet v-if="currentPage === 1" class="pa-10">
      <div class="d-flex align-center">
        <div>
          <h4 class="font-weight-bold mb-4">Upload my keystore file</h4>
          <div class="mb-10">Upload keystore file to unlock your wallet.</div>
          <v-file-input label="Upload..." outlined></v-file-input>
          <div @click="currentPage = 2">Next page</div>
        </div>
        <div class="text-right">
          <img
            src="@/assets/images/icons/keystore-file.jpg"
            alt="Keystore File"
            style="width: 85%"
          />
        </div>
      </div>
    </mew6-white-sheet>
    <mew6-white-sheet v-if="currentPage === 2" class="pa-10">
      <v-text-field
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Enter keystore file password"
        outlined
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
      />
      <div class="d-flex justify-center">
        <mew-button title="Access my wallet" button-size="xlarge" />
      </div>
      <div @click="currentPage = 1">Next page</div>
    </mew6-white-sheet>

    <page-indicator-dot class="mt-4" :items="2" :current-item="currentPage" />

    <warning-sheet
      title="NOT RECOMMENDED"
      description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. Learn more"
    />
  </v-sheet>
</template>

<script>
import pageIndicatorDot from '@/components/page-indicator-dot/PageIndicatorDot';
export default {
  name: 'UploadKeystoreFile',
  components: { pageIndicatorDot },
  props: {
    updateStep: {
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    currentPage: 1,
    showPassword: false
  })
};
</script>
