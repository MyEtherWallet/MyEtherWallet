<template>
  <div class="component-container mt-5">
    <mew6-white-sheet v-if="keystoreProgress === 0" class="pa-4 pa-lg-10">
      <div class="d-flex flex-column-reverse flex-lg-row align-center">
        <div>
          <h4 class="font-weight-bold mb-4">Upload my keystore file</h4>
          <div class="mb-10">
            Please upload the keystore file that unlocks your wallet.
          </div>
          <mew-button
            title="Upload..."
            btn-style="outline"
            color-theme="primary"
            btn-size="xlarge"
            :has-full-width="true"
            :shows-active-state="true"
            @click.native="uploadBtn"
          />
        </div>
        <div class="text-center text-lg-right mb-5 mb-lg-0">
          <img
            src="@/assets/images/icons/keystore-file.jpg"
            alt="Keystore File"
            style="width: 85%"
          />
        </div>

        <input
          ref="jsonInput"
          type="file"
          name="file"
          style="display: none"
          @change="uploadFile"
        />
      </div>
    </mew6-white-sheet>

    <mew6-white-sheet v-if="keystoreProgress === 1" class="pa-4 pa-lg-10">
      <mew-input
        v-model="password"
        label="Password"
        placeholder="Enter my keystore password"
        type="password"
      />
      <mew-button
        title="Access My Wallet"
        btn-size="xlarge"
        :has-full-width="true"
        @click.native="unlockBtn"
      />
    </mew6-white-sheet>

    <page-indicator-dot
      class="mt-4"
      :items="2"
      :current-item="keystoreProgress + 1"
    />
  </div>
</template>

<script>
import pageIndicatorDot from '@/components/page-indicator-dot/PageIndicatorDot';

export default {
  name: 'AccessKeystore',
  components: { pageIndicatorDot },
  props: {
    unlockKeystoreWallet: {
      type: Function,
      default: () => {}
    },
    step: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      keystoreInstance: {},
      password: ''
    };
  },
  computed: {
    keystoreProgress: {
      get() {
        return !this.step ? 0 : this.step - 1;
      },
      set(newVal) {
        this.$emit('input', newVal);
      }
    }
  },
  methods: {
    uploadFile(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = evt => {
        try {
          self.$emit('keystore', JSON.parse(evt.target.result));
        } catch (e) {
          throw new Error(e);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    },
    uploadBtn() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    unlockBtn() {
      this.unlockKeystoreWallet(this.password);
      this.password = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.component-container {
  width: 100%;
}

.sheet-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.sheet-content {
  padding: 48px 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;

  .items {
    height: 100%;
    width: calc(740px / 2);
  }
}

.password-container {
  padding: 26px;
}
</style>
