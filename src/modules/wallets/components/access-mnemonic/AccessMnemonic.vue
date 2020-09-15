<template>
  <div class="component-container">
    <div class="sheet-container">
      <v-sheet
        :outlined="true"
        color="white"
        :rounded="true"
        :max-width="740"
        :min-width="740"
        :min-height="340"
      >
        <div class="sheet-content">
          <v-container>
            <v-row align="center" justify="space-between">
              <v-col cols="8">
                <p class="mew-heading-1">Enter Mnemonic Phrase</p>
                <p>
                  Please type the mnemonic phrase you wrote down in the right
                  order.
                </p>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="length"
                  :label="`${length} words`"
                  :items="[12, 24]"
                  outlined
                />
              </v-col>
            </v-row>
          </v-container>
          <v-sheet class="mnemonic-phrase-container" elevation="2">
            <v-container>
              <v-row align="center" justify="space-around">
                <v-col v-for="n in length" :key="`mnemonicInput${n}`" cols="2">
                  <div class="mnemonic-input">
                    <label :for="`mnemonicInput${n}`">{{ n }}. </label>
                    <input
                      :ref="`mnemonicInput${n}`"
                      v-model="phrase[n]"
                      :name="`mnemonicInput${n}`"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
          <div class="extra-word-container">
            <v-container>
              <v-row align="center" justify="space-between">
                <p class="mew-heading-3">Extra Word</p>
                <mew-switch v-model="hasExtraWord" label="extra word" />
              </v-row>
            </v-container>
            <div v-show="hasExtraWord">
              <mew-input
                v-model="extraWord"
                label="Extra word"
                placeholder="Extra word"
              />
            </div>
          </div>
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
      extraWord: '',
      phrase: {},
      length: 12,
      hasExtraWord: false
    };
  },
  computed: {
    parsedPhrase() {
      return Object.values(this.phrase).join(' ');
    },
    isValidMnemonic() {
      return this.parsedPhrase.length === this.length;
    }
  },
  watch: {
    hasExtraWord(newVal) {
      console.log(newVal);
    },
    phrase: {
      deep: true,
      handler: function (newval) {
        const splitVal = newval[1].split(' ');
        if (splitVal.length === 12 || splitVal.length === 24) {
          this.length = splitVal.length;
          const newObj = {};
          splitVal.forEach((item, idx) => {
            newObj[idx + 1] = item;
          });
          this.phrase = newObj;
        }
      }
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
  height: 100%;
}

.mnemonic-phrase-container {
  border-radius: 5px !important;
  border: 1px solid rgb(230, 235, 239) !important; // hard coding this color for now based on abstract

  .mnemonic-input {
    width: 100%;
    position: relative;

    input {
      width: 100%;
      padding-left: 21px;
      padding-bottom: 2px;
      border-bottom: 1px solid rgb(230, 235, 239) !important; // hard coding this color for now based on abstract

      &:focus {
        outline: none !important;
        border-bottom: 1px solid black !important; // hard coding this color for now based on abstract
      }
    }

    label {
      position: absolute;
    }
  }
}

.extra-word-container {
  margin-top: 25px;
  border-top: 1px solid rgb(230, 235, 239) !important; // hard coding this color for now based on abstract
  border-bottom: 1px solid rgb(230, 235, 239) !important; // hard coding this color for now based on abstract
  padding: 0 20px;
}

.password-container {
  padding: 26px;
}
</style>
