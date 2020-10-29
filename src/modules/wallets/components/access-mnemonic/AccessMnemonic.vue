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
              :interactive-content="true"
              :panel-items="[
                {
                  name: 'Extra Word'
                }
              ]"
            >
              <template #panelBody1>
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
                btn-size="large"
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
                    btn-size="medium"
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
                <template #panelBody1>
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
                <template #panelBody2>
                  <div>
                    <v-radio-group v-model="selectedAddress">
                      <table width="100%">
                        <thead>
                          <tr class="table-header">
                            <th width="50%" class="align-center">Address</th>
                            <th width="25%" class="align-center">
                              Eth Balance
                            </th>
                            <th width="25%" class="align-center">
                              # of Tokens
                            </th>
                          </tr>
                        </thead>
                        <tbody class="table-row-class">
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
                                  <v-row justify="space-around">
                                    <mew-blockie
                                      width="25px"
                                      height="25px"
                                      :address="acc.address"
                                    />
                                    <span>{{
                                      acc.address | concatAddress
                                    }}</span>
                                  </v-row>
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
                        </tbody>
                      </table>
                    </v-radio-group>
                    <br />
                    <v-row align="center" justify="center">
                      <div>
                        <mew-button
                          title="Previous"
                          color-theme="basic"
                          icon="mdi-chevron-left"
                          icon-type="mdi"
                          :has-full-width="false"
                          btn-size="small"
                          icon-align="left"
                          btn-style="transparent"
                          @click.native="previousAddressSet"
                        />
                        <mew-button
                          title="Next"
                          color-theme="basic"
                          icon="mdi-chevron-right"
                          icon-type="mdi"
                          :has-full-width="false"
                          btn-size="small"
                          icon-align="right"
                          btn-style="transparent"
                          @click.native="nextAddressSet"
                        />
                      </div>
                    </v-row>
                  </div>
                </template>
              </mew-expand-panel>
              <div class="d-flex align-center flex-column">
                <mew-button
                  title="Access My Wallet"
                  btn-size="large"
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
import { mapActions, mapState } from 'vuex';
const parsedPaths = paths[mnemonicType].map(item => {
  const newObj = {};
  newObj['name'] = item['label'];
  newObj['value'] = item['path'];
  return newObj;
});

const MAX_ADDRESSES = 5;

export default {
  name: 'AccessMnemonic',
  filters: {
    concatAddress(val) {
      return `${val.substring(0, 11)}...${val.substring(
        val.length - 4,
        val.length
      )}`;
    }
  },
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
      currentIdx: 0,
      addressPage: 0
    };
  },
  computed: {
    ...mapState('global', ['Networks']),
    ...mapState('wallet', ['network']),
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
          this.setNetwork(found);
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
    ...mapActions('wallet', ['setNetwork']),
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
      this.addressPage += 1;
      this.selectedAddress = this.accounts[0].address;
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
      const pageDeductor = this.currentIdx / MAX_ADDRESSES;
      const idxDeductor = this.addressPage * MAX_ADDRESSES;
      this.addressPage -=
        this.currentIdx <= 10 ? pageDeductor : pageDeductor - 1;
      this.currentIdx -=
        this.currentIdx <= 10 ? idxDeductor : idxDeductor - MAX_ADDRESSES;
      this.setAddresses();
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  border-spacing: 0;
}

.table-header {
  text-align: center;
  background-color: #f0f0f0;
  th {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
  }
}

.table-row-class {
  tr:nth-child(odd) {
    background-color: #f9f9f9;
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
