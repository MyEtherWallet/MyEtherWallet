<template>
  <div class="component-container">
    <div class="sheet-container">
      <v-sheet
        :outlined="true"
        :color="'white'"
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
              :interactive-content="true"
              :panel-items="[
                {
                  name: 'Extra Word'
                }
              ]"
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
                title="Next"
                button-size="large"
                :disabled="!isValidMnemonic"
                @click.native="unlockBtn"
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
                    title="Next"
                    has-full-width
                    :disable="!selectedPath"
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
                  <div class="network-container">
                    <v-radio-group v-model="selectedNetwork">
                      <div v-for="type in networkTypes" :key="type">
                        <p class="text-capitalize mew-header-block">
                          {{ type }}
                        </p>
                        <v-container>
                          <v-row align="center" justify="space-between">
                            <v-col
                              v-for="(item, idx) in Networks[type]"
                              :key="item.service + idx"
                              cols="6"
                            >
                              <v-radio
                                :label="item.service"
                                :value="item.url"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </div>
                    </v-radio-group>
                  </div>
                </template>
                <template v-slot:panelBody2>
                  <div>
                    <v-radio-group v-model="selectedAddress">
                      <table width="100%">
                        <tr class="table-header">
                          <th width="50%" class="align-center">Address</th>
                          <th width="25%" class="align-center">Eth Balance</th>
                          <th width="25%" class="align-center"># of Tokens</th>
                        </tr>
                        <tr
                          v-for="acc in accounts"
                          v-show="accounts.length > 0"
                          :key="acc.address"
                        >
                          <td>
                            <v-row justify="space-around">
                              <v-col cols="1">
                                <v-radio label="" :value="acc.address" />
                              </v-col>
                              <v-col cols="8" class="text-truncate">
                                <span>{{ acc.address }}</span>
                                <input
                                  :ref="acc.address"
                                  :value="acc.address"
                                  class="address-copy-input"
                                />
                              </v-col>
                              <v-col cols="2">
                                <v-row>
                                  <v-icon
                                    small
                                    class="cursor--pointer"
                                    @click="copy(acc.address)"
                                    >mdi-content-copy</v-icon
                                  >
                                  <v-icon
                                    small
                                    class="cursor--pointer"
                                    @click="launchExplorrer(acc.address)"
                                    >mdi-launch</v-icon
                                  >
                                </v-row>
                              </v-col>
                            </v-row>
                          </td>
                          <td>
                            {{
                              acc.balance === 'Loading..'
                                ? acc.balance
                                : `${acc.balance} ${network.type.name}`
                            }}
                          </td>
                          <td>{{ acc.tokens }}</td>
                        </tr>
                        <tr v-show="accounts.length === 0">
                          Loading...
                        </tr>
                      </table>
                    </v-radio-group>
                  </div>
                </template>
              </mew-expand-panel>
              <div class="d-flex align-center flex-column">
                <mew-button
                  title="Access My Wallet"
                  button-size="large"
                  :disabled="!(selectedAddress && acceptTerms)"
                  @click.native="setMnemonicWallet"
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
      </v-sheet>
    </div>
  </div>
</template>

<script>
import { MNEMONIC as mnemonicType } from '@/modules/wallets/utils/bip44/walletTypes';
import paths from '@/modules/wallets/utils/bip44';
import { mapState } from 'vuex';
const parsedPaths = paths[mnemonicType].map(item => {
  const newObj = {};
  newObj['name'] = item['label'];
  newObj['value'] = item['path'];
  return newObj;
});

const MAX_ADDRESSES = 5;

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
    },
    hwWalletInstance: {
      type: Object,
      default: () => {
        return {};
      }
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
      selectedAddress: '',
      panelItems: [
        {
          name: 'Network'
        },
        {
          name: 'Address to interact with'
        }
      ],
      selectedNetwork: '',
      accounts: [],
      currentIdx: 0
    };
  },
  computed: {
    ...mapState(['Networks', 'network']),
    networkTypes() {
      const showFirst = ['ETH', 'ROP', 'RIN'];
      const typeArr = Object.keys(this.Networks).filter(item => {
        if (!showFirst.includes(item)) {
          return item;
        }
      });
      typeArr.unshift('ETH', 'ROP', 'RIN');
      return typeArr;
    },
    sheetColor() {
      return this.step < 3 ? 'white' : 'transparent';
    },
    parsedPhrase() {
      return Object.values(this.phrase).join(' ');
    },
    isValidMnemonic() {
      return Object.keys(this.phrase).length === this.length;
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
    wallet() {
      const wallet = this.accounts.find(item => {
        return item.address === this.selectedAddress;
      });

      return wallet ? wallet : null;
    }
  },
  watch: {
    selectedNetwork(newVal) {
      Object.values(this.Networks).forEach(itm => {
        const found = itm.find(network => {
          return network.url === newVal;
        });

        if (found) {
          this.$store.state.network = found; // replace with dispatch + new web3 instance
        }
      });
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
    },
    selectedPath: {
      deep: true,
      handler: function () {
        this.setAddresses();
      }
    },
    accounts: {
      deep: true,
      handler: function (newVal) {
        this.accounts = newVal;
      }
    }
  },
  mounted() {
    this.selectedNetwork = this.network.url;
  },
  methods: {
    copy(addr) {
      this.$refs[addr][0].select();
      document.execCommand('copy');
    },
    launchExplorrer(addr) {
      // eslint-disable-next-line
      window.open(
        this.network.type.blockExplorerAddr.replace('[[address]]', addr),
        '_blank'
      );
    },
    async setAddresses() {
      this.accounts = [];
      for (let i = this.currentIdx; i < this.currentIdx + MAX_ADDRESSES; i++) {
        const account = await this.hwWalletInstance.getAccount(i);
        this.accounts.push({
          address: account.getAddressString(),
          account: account,
          idx: i,
          balance: 'Loading..',
          tokens: 'Loading..'
        });
      }

      this.currentIdx += MAX_ADDRESSES;
      this.selectedAddress = this.accounts[
        this.currentIdx - MAX_ADDRESSES
      ].address;
    },
    unlockBtn() {
      this.unlockMnemonicWallet(this.parsedPhrase, this.extraWord);
    },
    setPath() {
      this.setMnemonicPath(this.selectedPath);
    },
    setMnemonicWallet() {
      this.setAddress(this.wallet.account);
    },
    nextAddressSet() {
      this.setAddresses();
    },
    previousAddressSet() {
      this.currentIndex =
        this.currentIndex - 2 * MAX_ADDRESSES < 0
          ? 0
          : this.currentIndex - 2 * MAX_ADDRESSES;
      this.setAddresses();
    }
  }
};
</script>

<style lang="scss" scoped>
.table-header {
  text-align: center;
  background-color: #f0f0f0;
  th {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
  }
}

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

.network-container {
  max-height: 250px;
  overflow: scroll;
}

.address-copy-input {
  opacity: 0;
  position: absolute;
  z-index: -1;
}
</style>
