<template>
  <div class="component-container">
    <mew-carousel carousel-height="400" :total-slides="2">
      <template v-slot:slide1>
        <div class="sheet-container">
          <v-sheet
            :outlined="true"
            color="white"
            :rounded="true"
            :max-width="740"
            :min-width="740"
            :max-height="340"
            :min-height="340"
          >
            <div class="sheet-content">
              <div class="items">
                <p class="mew-heading-1">Upload my Keystore File</p>
                <p>
                  Please upload the keystore file that <br />
                  unlocks your wallet.
                </p>
                <br />
                <br />
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
              <div class="items">
                <img
                  src="@/assets/images/backgrounds/bg-spaceman.png"
                  width="100%"
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
          </v-sheet>
        </div>
      </template>
      <template v-slot:slide2>
        <div class="sheet-container">
          <v-sheet
            :outlined="true"
            color="white"
            :rounded="true"
            :max-width="475"
            :min-width="475"
            :max-height="215"
            :min-height="215"
          >
            <div class="password-container">
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
            </div>
          </v-sheet>
        </div>
      </template>
    </mew-carousel>
  </div>
</template>

<script>
export default {
  name: 'AccessKeystore',
  props: {
    unlockKeystoreWallet: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      keystoreInstance: {},
      password: ''
    };
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
