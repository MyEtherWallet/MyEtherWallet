<template>
  <div class="component-container">
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
              button-size="xlarge"
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
  </div>
</template>

<script>
export default {
  name: 'AccessMnemonic',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    btnCall: {
      type: Function,
      default: () => {}
    },
    unlockMnemonicPhrase: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      phrase: '',
      password: '',
      length: 12
    };
  },
  computed: {
    mnemonicPhraseInputs() {
      return this.phrase === ''
        ? new Array(this.length)
        : this.phrase.split(' ');
    }
  },
  methods: {
    unlockBtn() {
      this.unlockMnemonicPhrase(this.phrase, this.password);
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
