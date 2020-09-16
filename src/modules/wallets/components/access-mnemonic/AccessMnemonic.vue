<template>
  <div class="component-container">
    <div class="sheet-container">
      <v-sheet
        :outlined="true"
        :color="sheetColor"
        :rounded="true"
        :max-width="740"
        :min-width="475"
        :min-height="340"
      >
        <div v-if="step === 1" class="sheet-content">
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
          <div class="mt-10">
            <mew-expand-panel
              :has-dividers="true"
              :is-toggle="true"
              :panel-items="panelItem"
            >
              <template v-slot:panelBody1>
                <mew-input
                  v-model="extraWord"
                  type="password"
                  label="Extra word"
                  placeholder="Extra word"
                />
              </template>
            </mew-expand-panel>
          </div>
          <v-container class="password-container">
            <v-col align="center" justify="center">
              <mew-button
                title="Access My Wallet"
                button-size="large"
                :disabled="!disableBtn"
                @click.native="unlockBtn"
              />
              <mew-checkbox
                v-model="acceptTerms"
                label="To access my wallet, I accept "
                :link="link"
                class="justify-center"
              />
            </v-col>
          </v-container>
        </div>
        <v-container
          v-if="step === 2"
          class="overlay-content pa-8 mt-10"
          fill-height
        >
          <v-row align="center" justify="center">
            <v-col cols="12">
              <mew-select
                v-model="selectedPath"
                label="HD Derivation Path"
                :items="paths"
              />
              <v-row align="center" justify="center">
                <v-col cols="6">
                  <mew-button
                    button-size="medium"
                    title="Choose Path"
                    has-full-width
                    @click.native="setPath"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="step === 3">
          <v-row align="center" justify="center">
            <v-col cols="12">
              <mew-expand-panel
                :interactive-content="true"
                :panel-items="panelItems"
              >
                <template v-slot:panelBody1>
                  <span>Panel slot example</span>
                  <button>
                    {{ interactiveContent ? 'Click me' : 'You cant click me' }}
                  </button>
                </template>
                <template v-slot:panelBody2>
                  <span>Panel slot example</span>
                  <button>
                    {{ interactiveContent ? 'Click me' : 'You cant click me' }}
                  </button>
                </template>
              </mew-expand-panel>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import { MNEMONIC as mnemonicType } from '@/modules/wallets/utils/bip44/walletTypes';
import paths from '@/modules/wallets/utils/bip44';
const parsedPaths = paths[mnemonicType].map(item => {
  const newObj = {};
  newObj['name'] = item['label'];
  newObj['value'] = item['path'];
  return newObj;
});
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
    unlockMnemonicWallet: {
      type: Function,
      default: () => {}
    },
    step: {
      type: Number,
      default: 1
    },
    setMnemonicPath: {
      type: Function,
      default: () => {}
    },
    setAddress: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      extraWord: '',
      phrase: {},
      length: 12,
      acceptTerms: false,
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      },
      paths: parsedPaths,
      selectedPath: null,
      wallet: {},
      panelItems: [
        {
          name: 'Network'
        },
        {
          name: 'Address to interact with'
        }
      ]
    };
  },
  computed: {
    sheetColor() {
      return this.step < 3 ? 'white' : 'transparent';
    },
    parsedPhrase() {
      return Object.values(this.phrase).join(' ');
    },
    isValidMnemonic() {
      return Object.keys(this.phrase).length === this.length;
    },
    disableBtn() {
      return this.isValidMnemonic && this.acceptTerms;
    },
    revertedPath() {
      const newObj = {};
      if (this.selectedPath !== null) {
        newObj['path'] = this.selectedPath['value'];
        newObj['label'] = this.selectedPath['name'];
        return newObj;
      }
      return this.selectedPath;
    },
    panelItem() {
      return [
        {
          name: 'Extra Word'
        }
      ];
    }
  },
  watch: {
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
      this.unlockMnemonicWallet(this.parsedPhrase, this.extraWord);
    },
    setPath() {
      this.setMnemonicPath(this.selectedPath);
    },
    setMnemonicWallet() {
      this.setAddress(this.wallet);
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
